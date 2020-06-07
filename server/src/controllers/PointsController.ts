import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

  async index(request: Request, response: Response) {
    const { city, uf, items} = request.query;
    
    if (!city && !uf && !items) {
      const points = await knex('points').select('*');
      return response.json(points);
    }

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://192.168.1.69:3333/uploads/${point.image}`
        }
      });

    return response.json(serializedPoints);
  }

  // Serialização
  // API Transform
  
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point_db  = await knex('points').select('*').where('id', id).first();

    if (!point_db) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const point = {
      ...point_db,
      image_url: `http://192.168.1.69:3333/uploads/${point_db.image}`
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id);
      //.select('items.title  ');

    return response.json({point, items});
  }
  
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    console.log(point);

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
      return {
        item_id,
        point_id
      }
    });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({ 
      id: point_id,
      ...point
     });
  }

}

export default PointsController;
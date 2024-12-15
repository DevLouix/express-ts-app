import  { NextFunction, Request, Response } from "express";

export async function indexController(req:Request, res: Response, next: NextFunction) {
    res.status(200).json("Index Route")
}
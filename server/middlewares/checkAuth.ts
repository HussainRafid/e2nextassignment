import jwt, { JwtPayload } from 'jsonwebtoken'
const pool = require('../db.ts')
import { Request, Response, NextFunction } from 'express'
import { UserType } from '../types/UserType'


const checkAuth = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const token = req.cookies?.token as string 
        if (!token){
            res.status(401).json({
                message:"Invalid Token, User is unauthorized"
            })
        }else {
            const verification = await jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload
            if(!verification){
                res.status(401).json({
                    message:"User is unauthorized"
                })

            }else {
                const email: string = verification.email
                const checkedUsers = await pool.query('SELECT * FROM users WHERE email = ?', [email]) as UserType[]
                if(checkedUsers[0].isDeactivated){
                    res.status(401).json({
                        message:"User is deactivated, You can not use this account"
                    })
                }else {
                    (req as any).user = {email, role:checkedUsers[0].type}
                    next()
                }
            }
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"An error has occured",
            data:err
        })
    }
}

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    console.log(user)
    if (!user) {
        return res.status(401).json({ message: "User is unauthorized" })
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied, admins only" })
    }
    next()
}

module.exports = {checkAuth,checkAdmin}
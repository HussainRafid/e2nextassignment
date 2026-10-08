import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import type { UsersRes, UserType } from '../types/UserType'
const {checkAuth, checkAdmin} = require('../middlewares/checkAuth')
const jwt = require("jsonwebtoken")
const pool = require('../db')
const Router = express.Router()

Router.route('/').get(checkAuth, async (_req:Request, res:Response) => {
    try {
        const usersData = await pool.query('SELECT * FROM users')
        res.status(200).json({
            message:"Success",
            status:200,
            data:usersData
        } as UsersRes)
    }catch(err){
        console.log('An error occured while getting users data:', err)
        res.status(500).json({
            message:"An error occured while getting users data",
            data:err
        })
    }
})


Router.route('/login').post(async (req:Request, res:Response) => {
    try {
        const {email, password} = req.body 
        if(!email || !password || email === '' || password === ''){
            res.status(400).json({
                message:"All Field are Required"
            })
        }else {
            const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email])
            const userExisting: UserType = rows[0]
            if(!userExisting){
                res.status(404).json({
                    message:"User Not Found"
                })
            }else {
                if(userExisting.isDeactivated){
                    res.status(500).json({
                        message:"User is deactivated, You can not login into this account"
                    })
                }else {
                    const isMatch = await bcrypt.compare(password, userExisting.password)
                    if(!isMatch){
                        res.status(500).json({
                            message:"Password is Incorrect"
                        })
                    }else {
                        const token = jwt.sign({email, role:userExisting.type}, process.env.SECRET_KEY, {expiresIn:'1d'})
                        
                        res.cookie('token', token, {
                            httpOnly:true,
                            secure:false,
                            maxAge: 24 * 60 * 60 * 1000,
                        })
                        res.status(200).json({
                            message:"User Logged in successfully!",
                            data:{email, role:userExisting.type}
                        })
                    }
                }
            }
        }
    }
    catch(err){
        console.log('An error occured while logging in:', err)
        res.status(500).json({
            message:"Unable to login",
            data:err
        })
    }
})

Router.route('/logout').post(async (req:Request, res:Response) => {
    res.clearCookie("token").status(200).json({
        message:"Logged out successfully"
    })
})
Router.route('/:id/toggle').patch(checkAuth,checkAdmin,async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid user id" })
        }
        const checkAdmin = await pool.query('SELECT * FROM users WHERE id = ?', [id])
        if(checkAdmin[0] && checkAdmin[0].type === 'admin'){
            res.status(500).json({message:"Admins Can not be deactivated"})
        }else {
            const result = await pool.query(
                `UPDATE users SET isDeactivated = NOT isDeactivated WHERE id = ?`,
                [id]
            )
    
            if (Number(result.affectedRows) === 0) {
                return res.status(404).json({ message: "User Not Found" })
            }
            
            const rows = await pool.query(
                `SELECT id, email, type, isDeactivated FROM users WHERE id = ?`,
                [id]
            )
            
            res.status(200).json({
                message: "User activation toggled",
                status: 200,
                data: { ...rows[0], isDeactivated: Boolean(rows[0].isDeactivated) }
            })
        }

    } catch (err) {
        console.log("An error occurred while toggling user activation:", err)
        res.status(500).json({
            message: "An error occurred while toggling user activation",
            status: 500
        })
    }
})


module.exports = Router
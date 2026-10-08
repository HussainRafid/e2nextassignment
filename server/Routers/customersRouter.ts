import express, {Request, Response} from 'express';
import type {CustomerRes, CustomersRes} from '../types/CustomerType'
import { FileResponse, FilesResponse, FileType } from '../types/FileType';
const Router = express.Router()
const pool = require('../db.ts')
const upload = require('../middlewares/uploadMiddleware')
const moment = require('moment')
import { randomUUID } from 'crypto';
import path from 'path'
import fs from 'fs'

Router.route('/').get(async (req,res) => {
    try {
        
        const step = Number(req.query.step) || 0
        const search = req.query?.search
        if(search && search !== ''){
            const searchVal = `%${search}%`
            const data = await pool.query(`SELECT * FROM customers WHERE name LIKE ? OR email LIKE ?`, [searchVal,searchVal])
            res.status(200).json({
                message:"Data Retierved Successfully",
                status:200,
                data
            } as CustomersRes)
        }else {
            const limit = 20
            const offset = step * limit
            const data = await pool.query(`SELECT * FROM customers LIMIT ? OFFSET ?`, [limit, offset])
            res.status(200).json({
                message:"Data Retierved Successfully",
                status:200,
                data
            } as CustomersRes)
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

Router.route('/:id').get(async (req, res) => {
    try {
        const id = req.params.id
        const data = await pool.query(`SELECT * FROM customers WHERE id = ?`, [id])
        if(!data){
            res.status(404).json({
                message:"Customer does not exist",
            })
        }else {
            res.status(200).json({
                message:"success",
                status:200,
                data:data[0]
            } as CustomerRes)
        }
    }catch(err){
        console.log("An error occurred while getting customer data:", err)
        res.status(500).json({
            message:"Internal Server error",
            status:500, 
            data:err
        })
    }
})


Router.route('/:id/upload').post(upload.single('file'),async (req:Request,res:Response) => {
    try {
        const id = Number(req.params.id)
        if(!(req as any).file){
            res.status(400).json({
                message:"File was not uploaded"
            })
        }else {
            const requestFile = (req as any).file
            const uploadDate = moment().format('YYYY-MM-DD')
            const fileData: FileType = {
                id:randomUUID(),
                filename:requestFile.originalname,
                size:requestFile.size,
                format:requestFile.mimetype,
                relatedTo:id,
                path:requestFile.path,
                uploaded_at:uploadDate
            }

            const query = `
                INSERT INTO files (id, filename, size, format, related_to, path)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await pool.execute(query, [fileData.id, fileData.filename, fileData.size, fileData.format, fileData.relatedTo, fileData.path])

            res.status(201).json({
                message:"File uploaded successfully",
                status:201,
                data:fileData
            } as FileResponse)
        }
    }catch(err){
        console.log('An error occurred while uploading file:', err)
        res.status(500).json({
            message:"An error occurred while uploading file:",
            status:500,
            data:err
        })
    }
}).get(async (req,res) => {
    try {
        const id = Number(req.params.id) 
        const files = await pool.query("SELECT * FROM files WHERE related_to = ?", [id])
        console.log(files)
        res.status(200).json({
            message:"success",
            status:200,
            data:files
        } as FilesResponse)
    }
    catch(err){
        console.log('An error occurred while getting files:', err)
        res.status(500).json({
            message:"An error occurred while getting files",
            data:err
        })
    }   
})

Router.route('/files/:id').get(async (req:Request, res:Response) => {
    try {
        const fileId = req.params.id
        const fileData = await pool.query(`SELECT * FROM files WHERE id = ?`, [fileId])
        const {path:pathname} = fileData[0]
        const absolutePath = path.resolve(pathname)

        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ message: "File does not exist" })
        }
        res.download(absolutePath, pathname, (err) => {
            if (err && !res.headersSent) {
                res.status(500).json({ message: "Download failed" })
            }
        })
    }catch(err){
        console.log('An error occurred while downloading file:',err)
        res.status(500).json({
            message:"Unable to download file",
            data:err
        })
    }
})



module.exports = Router
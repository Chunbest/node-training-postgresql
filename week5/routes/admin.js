const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Admin')

const { isValidString, isNumber } = require('../utils/validUtils')


router.post('/coaches/:userId', async (req, res, next) => {
	try {
		const { userId } = req.params
		const { experience_years, description, profile_image_url } = req.body
		if (!isValidString(userId) || !isNumber(experience_years) || !isValidString(description)) {
			res.status(400).json({
				status: "failed",
				message:"欄位未填寫正確"
			})
			//寫到這裡
		res.status(201).json({
			status: "success",
			data: {
				user: {
					name: 'userResult.name',
					role: 'userResult.role'
				},
				coach: {}
			}
		})
	} catch (error) {
		logger.error(error)
		next(error)
	}
})



module.exports = router
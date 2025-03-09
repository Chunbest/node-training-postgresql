require("dotenv").config()
const http = require("http")
const AppDataSource = require("./db")
const errorHandle = require("./errorhandle");

const isValidString = (value) => {
	return typeof value === 'string' && value.trim() !== '';
}

// 可增加其他檢查: 例如正整數
const isNumber = (value) => {
	return typeof value === 'number' && !isNaN(value);
}



const requestListener = async (req, res) => {
	const headers = {
		"Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
		"Content-Type": "application/json"
	}

	let body = ""
	req.on("data", (chunk) => {
		body += chunk
	})

	if (req.url === "/api/credit-package" && req.method === "GET") {
		try {
			const data = await AppDataSource.getRepository('CreditPackage').find({
				select: ['id', 'name', 'credit_amount', 'price']
			})
			res.writeHead(200, headers);
			res.write(JSON.stringify({
				status: "success",
				data: data,
			}))
			res.end();
		} catch (error) {
			errorHandle(res);
		}

	} else if (req.url === "/api/credit-package" && req.method === "POST") {
		//新增
		req.on('end', async () => {

			try {
				const { name, credit_amount, price } = JSON.parse(body);
				if (!isValidString(name || !isNumber(credit_amount | isNumber(price)))) {
					res.writeHead(400, headers);
					res.write(JSON.stringify({
						status: "failed",
						data: "欄位未填寫正確",
					}))
					res.end();
					return;
				}

				const creditPackage = AppDataSource.getRepository('CreditPackage')
				const findCreditPackage = await creditPackage.find({
					where: {
						name: name
					}
				})
				if (findCreditPackage.length > 0) {
					res.writeHead(409, headers);
					res.write(JSON.stringify({
						status: "failed",
						data: "資料重複",
					}))
					res.end();
					return;
				}
				const newCreditPackage = creditPackage.create({
					name,
					credit_amount,
					price
				})

				const result = await creditPackage.save(newCreditPackage);

				res.writeHead(200, headers);
				res.write(JSON.stringify({
					status: "success",
					data: result
				}))
				res.end();
				return;
			} catch (error) {
				errorHandle(res);
			}
		})
	} else if (req.url.startsWith("/api/credit-package/") && req.method === "DELETE") {
		// 刪除
		try {
			const creditPackageId = req.url.split("/").pop();
			if (!isValidString(creditPackageId)) {
				res.writeHead(400, headers);
				res.write(JSON.stringify({
					status: "failed",
					data: "Id錯誤"
				}))
				res.end();
				return;
			}
			const result = await AppDataSource.getRepository('CreditPackage').delete(creditPackageId);
			if (result.affected === 0) {
				res.writeHead(400, headers);
				res.write(JSON.stringify({
					status: "failed",
					data: "Id錯誤"
				}))
				res.end();
				return;
			}
			res.writeHead(400, headers);
			res.write(JSON.stringify({
				status: "success",
			}))
			res.end();
		} catch (error) {
			errorHandle(res);
		}
	} else if (req.url === "/api/coaches/skill" && req.method === "GET") {
		try {
			//從資料庫取得用find
			const data = await AppDataSource.getRepository('Skill').find({
				select: ['id', 'name']
			})
			res.writeHead(200, headers);
			res.write(JSON.stringify({
				status: "success",
				data: data,
			}))
			res.end();
		} catch (error) {
			errorHandle(res);
		}
	} else if (req.url === "/api/coaches/skill" && req.method === "POST") {
		req.on('end', async () => {
			try {
				const { name } = JSON.parse(body);
				if (!isValidString(name)) {
					res.writeHead(400, headers);
					res.write(JSON.stringify({
						status: "failed",
						message: "欄位未填寫正確"
					}))
					res.end();
					return;
				}
				const skillRepo = AppDataSource.getRepository('Skill');
				const findSkill = await skillRepo.find({
					where: {
						name
					}
				})
				if (findSkill.length > 0) {
					res.writeHead(409, headers);
					res.write(JSON.stringify({
						status: "failed",
						message: "資料重複"
					}))
					res.end();
					return
				}
				const saveSkill = skillRepo.create({ name });
				const resultSkill = await skillRepo.save(saveSkill)
				res.writeHead(200, headers);
				res.write(JSON.stringify({
					status: "success",
					data: resultSkill
				}))
				res.end();
			} catch (error) {
				errorHandle(res);

			}
		})

	} else if (req.url.startsWith("/api/coaches/skill/") && req.method === "DELETE") {
		try {
			const skillId = req.url.split('/').pop();
			if (!isValidString(skillId)) {
				res.writeHead(400, headers);
				res.write(JSON.stringify({
					status: "failed",
					message: "ID錯誤"
				}))
				res.end();
				return;
			}
			const result = await AppDataSource.getRepository('Skill').delete(skillId)
			if (result.affected === 0) {
				res.writeHead(400, headers);
				res.write(JSON.stringify({
					status: "failed",
					message: "ID錯誤"
				}))
				res.end();
				return;
			}
			res.writeHead(200, headers);
			res.write(JSON.stringify({
				status: "success",
			}))
			res.end();

		} catch (error) {
			errorHandle(res);
		}
	}
	else if (req.method === "OPTIONS") {
		res.writeHead(200, headers)
		res.end()
	} else {
		res.writeHead(404, headers)
		res.write(JSON.stringify({
			status: "failed",
			message: "無此網站路由",
		}))
		res.end()
	}
}

const server = http.createServer(requestListener)

async function startServer() {
	await AppDataSource.initialize()
	console.log("資料庫連接成功")
	server.listen(process.env.PORT)
	console.log(`伺服器啟動成功, port: ${process.env.PORT}`)
	return server;
}

module.exports = startServer();

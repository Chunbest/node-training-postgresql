// 驗證字串型別, 
const isValidString = (value) => {
	return typeof value === 'string' && value.trim() !== '';
}

// 驗證數字型別, 可增加其他檢查
const isNumber = (value) => {
	return typeof value === 'number' && !isNaN(value);
}

module.exports = {
	isValidString,
	isNumber,
}
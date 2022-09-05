const internalError = (error) => {
	console.log(error);
	let errorToReturn = {};
	switch (error.code) {
		case 403:
			errorToReturn.status = 500;
			errorToReturn.message = 'No se pudo enviar el email.';
			break;
		default:
			errorToReturn.status = 500;
			errorToReturn.message = 'Algo salió mal. Error en el servidor.';
	}
	return errorToReturn;
};




class ErrorWithStatusAndMessage extends Error {
	constructor(message, statusCode) {
		super(message);
		this.name = 'CustomErrorFromController'
		this.statusCode = statusCode
	}
};

const errorWithStatusAndMessage = (error) => {
	return {
		status: error.statusCode,
		message: error.message
	}
};

const errorHandler = (error) => {
	return error.name === 'CustomErrorFromController' ? errorWithStatusAndMessage(error) : internalError(error);
};


module.exports = {
	errorHandler,
	ErrorWithStatusAndMessage
};
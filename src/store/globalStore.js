import {createStore} from 'redux';
import loginReducer from './reducers/loginReducer';

const checkLoginFirst=(performAction)=>{
	fetch("http://localhost:8888/getUser",{
		method: "GET",
		headers: { "content-type": "application/json" },
		credentials: "include"
	})
	.then(res=>res.json())
	.then(res=>performAction(res));
}


const defaultGlobalState= {
	user: {
		username: "",
		userId: "",
		email: "",
	},
	showLoginOrSignup: false,
	loggedIn: false,
	checkLoginFirst,
	message: "",
	showMessage: false,
	messageType: "",
}

const configureStore = (state=defaultGlobalState)=> {
	return createStore(loginReducer,state);
}

export default configureStore;
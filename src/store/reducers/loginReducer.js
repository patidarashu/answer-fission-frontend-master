const loginReducer= (state,action)=>{
	const newState={...state};
	switch(action.type) {
		case "SET_USER":
			newState.user=action.payload;
			return newState;
		case "SET_SHOW_LOGIN_OR_SIGNUP": 
			newState.showLoginOrSignup=action.payload;
			return newState;
		case "SET_LOGGED_IN":
			newState.loggedIn=action.payload;
			return newState;
		case "SET_MESSAGE":
			newState.message=action.payload;
			return newState;
		case "SET_MESSAGE_TYPE":
			newState.messageType=action.payload;
			return newState;
		case "SET_SHOW_MESSAGE": 
			newState.showMessage=action.payload;
			return newState;
		default:
			return newState;
	}
}

export default loginReducer;
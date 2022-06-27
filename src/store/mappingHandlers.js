export const mapStateToProps = (state) => {
	return {...state};
}
export const mapDispatchToProps = (dispatch) => {
	const dispatches={
		setUser: (payload)=> dispatch({type: "SET_USER", payload}),
		setShowLoginOrSignup: (payload)=> dispatch({type: "SET_SHOW_LOGIN_OR_SIGNUP", payload}),
		setLoggedIn: (payload)=> dispatch({type: "SET_LOGGED_IN", payload}),
		setMessage: (payload)=> dispatch({type: "SET_MESSAGE", payload}),
		setMessageType: (payload)=> dispatch({type: "SET_MESSAGE_TYPE", payload}),
		setShowMessage: (payload)=> dispatch({type: "SET_SHOW_MESSAGE", payload}),
	};
	return dispatches;
}
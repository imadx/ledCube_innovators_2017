function notify(msg){
	Materialize.toast(`
		<span>
		<i class="material-icons left">info</i>
		` + msg + `
		</span>
		`, 4000);
}

function emitMessage(tag, data){
    socket.emit(tag, data);
}

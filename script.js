"use strict";

$('document').ready(function(){
	const columns = "abcdefgh".split("");
	const rows = "12345678".split("");
	generateBoard(columns, rows, true);

});


//Functions and Objects
//Create div of square
function generateSquare(letter, number, color){
	
	const element = "<div class = 'square " + color + "' id='" + letter + number + "'>"+letter+number+"</div>";
	return element;
}
//append 64 squares to a board
function generateBoard(columnsArr, rowsArr, isWhite){

	var square = new Square("light-square","dark-square");
	if(isWhite){
		rowsArr.reverse();
	}
	else{
		columnsArr.reverse();
	}

	var toAppend = "";
	for (let i = 0; i < rowsArr.length; i++) {
		for (let j = 0; j < columnsArr.length; j++){
			toAppend = toAppend + generateSquare(columnsArr[j],rowsArr[i],square.color);
			square.toggle();
		}
		square.toggle();
	}
	$("#board").append(toAppend);
}


//Square Object constructor
function Square(light, dark) {
	this.light = light;
	this.dark = dark;
	this.color = light;

	this.toggle = function(){
		if(this.color == this.light)
    	this.color = this.dark;
   	else
    	this.color = this.light;
	}
}

//Chess Piece constructor
function Piece(position, color) {
	this.position = position;
	this.color = color;
}

//King constructor
function King(position,color){
	Piece.call(this, position, color)
	this.image = "king-"+color+".png";
}
King.prototype = Object.create(Piece.prototype);

//Queen Constructor
function Queen(position,color){
	Piece.call(this, position, color)
	this.image = "queen-"+color+".png";
}
Queen.prototype = Object.create(Piece.prototype);

//Pawn constructor
function Pawn(position,color){
	Piece.call(this, position, color)
	this.image = "pawn-"+color+".png";
}
Pawn.prototype = Object.create(Piece.prototype);

//Rook constructor
function Rook(position,color){
	Piece.call(this, position, color)
	this.image = "rook-"+color+".png";
}
Rook.prototype = Object.create(Piece.prototype);

//Knight constructor
function Knight(position,color){
	Piece.call(this, position, color)
	this.image = "knight-"+color+".png";
}
Knight.prototype = Object.create(Piece.prototype);

//Bishop constructor
function Bishop(position,color){
	Piece.call(this, position, color)
	this.image = "bishop-"+color+".png";
}
Bishop.prototype = Object.create(Piece.prototype);


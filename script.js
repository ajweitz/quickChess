"use strict";

const columns = "abcdefgh".split("");
const rows = "12345678".split("");
var squares = [];
	for (let i = 0; i < rows.length; i++) {
		for (let j = 0; j < columns.length; j++){
			squares.push(columns[j]+rows[i]);
		}
	}

const STARTING_POSITION = {
	a2: "w", b2: "w", c2: "w", d2: "w", e2: "w", f2: "w", g2: "w", h2: "w",
	a7: "b", b7: "b", c7: "b", d7: "b", e7: "b", f7: "b", g7: "b", h7: "b",
	a1: "Rw",b1: "Nw", c1: "Bw", d1: "Qw", e1: "Kw", f1: "Bw", g1: "Nw", h1: "Rw",
	a8: "Rb",b8: "Nb", c8: "Bb", d8: "Qb", e8: "Kb", f8: "Bb", g8: "Nb", h8: "Rb"
};
//@todo: delete this
const testPosition = {
	a3: "w", b4: "w", c3: "w", d2: "w", e2: "w", f2: "w", g2: "w", h2: "w",
	a7: "b", c7: "b", d7: "b", e7: "b", f7: "b", g7: "b", h7: "b",
	a1: "Rw",b1: "Nw", d1: "Qw", e1: "Kw", f1: "Bw", g1: "Nw", h1: "Rw",
	a8: "Rb",b8: "Nb", c8: "Bb", d8: "Qb", e8: "Kb", f8: "Bb", g8: "Nb", h8: "Rb"
};

$('document').ready(function(){
	generateBoard(columns, rows, true);
	var board = new Board(true);
	board.map(STARTING_POSITION);
	board.draw();
	board.map(testPosition);
	board.draw();
});


//Functions and Objects
//Create div of square
function generateSquare(letter, number, color){
	const element = "<div class = 'square " + color + "' id='" + letter + number + "'></div>";
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

function pieceFactory(pieceName, position, color){
	return eval("new " + pieceName+"('"+position+"','"+color+"')");
}
//King constructor
function King(position,color){
	Piece.call(this, position, color);
	this.image = "king-"+color+".png";
}
King.prototype = Object.create(Piece.prototype);

//Queen Constructor
function Queen(position,color){
	Piece.call(this, position, color);
	this.image = "queen-"+color+".png";
}
Queen.prototype = Object.create(Piece.prototype);

//Pawn constructor
function Pawn(position,color){
	Piece.call(this, position, color);
	this.image = "pawn-"+color+".png";
}
Pawn.prototype = Object.create(Piece.prototype);

//Rook constructor
function Rook(position,color){
	Piece.call(this, position, color);
	this.image = "rook-"+color+".png";
}
Rook.prototype = Object.create(Piece.prototype);

//Knight constructor
function Knight(position,color){
	Piece.call(this, position, color);
	this.image = "knight-"+color+".png";
}
Knight.prototype = Object.create(Piece.prototype);

//Bishop constructor
function Bishop(position,color){
	Piece.call(this, position, color);
	this.image = "bishop-"+color+".png";
}
Bishop.prototype = Object.create(Piece.prototype);

//Board constructor
function Board(canMove){
	this.canMove = canMove;
	this.nullify();
}
Board.prototype.nullify = function(){
	for(let i = 0; i<squares.length; i++)
		eval("this."+squares[i]+"=null");
}
Board.prototype.draw = function() {
	for(let i = 0; i<squares.length; i++){
		$("#"+squares[i]).empty();
		if(this[squares[i]] != null){
			const pieceImg = "<img class='piece'src='"+this[squares[i]].image+"'</img>";
			$("#"+squares[i]).append(pieceImg);	
		}
	}
};

Board.prototype.map = function(hash){
	const MAP = {
		"w": ["Pawn","white"], "b": ["Pawn","black"], "Rw": ["Rook","white"],"Rb": ["Rook","black"],
		"Nw": ["Knight","white"], "Nb": ["Knight","black"], "Bw": ["Bishop","white"],"Bb": ["Bishop","black"],
		"Kw": ["King","white"], "Kb": ["King","black"], "Qw": ["Queen","white"],"Qb": ["Queen","black"]
	};
	this.nullify();
	for (var key in hash){
		this[key] = pieceFactory(MAP[hash[key]][0], key, MAP[hash[key]][1]);
	}
};
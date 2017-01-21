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
	a8: "Rb",b8: "Nb", c8: "Bb", d8: "Qb", e8: "Kb", f8: "Bb", g8: "Nb", h8: "Rb", canCastleLeft: true, canCastleRight: true, player: "white"
};
//@todo: delete this
const testPosition = {
	a3: "w", b4: "w", c3: "w", d2: "w", e5: "w", f2: "w", g2: "w", h2: "w",
	a7: "b", c7: "b", d7: "b", e7: "b", f7: "b", g7: "b", h7: "b",
	a1: "Rw",b1: "Nw", d1: "Qw", e1: "Kw", f1: "Bw", g1: "Nw", h1: "Rw",
	a8: "Rb",b8: "Nb", c8: "Bb", d8: "Qb", e8: "Kb", f8: "Bb", g8: "Nb", h8: "Rb",
	playedMove: "f7f5", canCastleLeft: true, canCastleRight: true, player: "white"
};

$('document').ready(function(){
	generateBoard(columns, rows, true);
	var board = new Board(true);
	board.map(STARTING_POSITION);
	board.draw();
	board.map(testPosition);
	board.draw();
	board.possibleMoves("e5");
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
	this.type = "king";
	this.image = "king-"+color+".png";
}
King.prototype = Object.create(Piece.prototype);

//Queen Constructor
function Queen(position,color){
	Piece.call(this, position, color);
	this.type = "queen";
	this.image = "queen-"+color+".png";
}
Queen.prototype = Object.create(Piece.prototype);

//Pawn constructor
function Pawn(position,color){
	Piece.call(this, position, color);
	this.type = "pawn";
	this.image = "pawn-"+color+".png";
}
Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.possibleMoves = function(board){
	var possibleMovesArr = [];
	var thisLetterASCII = this.position.charCodeAt(0);
	if(this.color == "white"){
			var plusOne = this.position[0]+(+this.position[1]+1);
			var diagonalLeft = String.fromCharCode(thisLetterASCII-1) + (+this.position[1]+1);
			var diagonalRight = String.fromCharCode(thisLetterASCII+1) + (+this.position[1]+1);
			if(this.position[1] == "2"){
				var plusTwo = this.position[0]+(+this.position[1]+2);
			}
			var enemy = "black";
	}else{
			var plusOne = this.position[0]+(+this.position[1]-1);
			var diagonalLeft = String.fromCharCode(thisLetterASCII+1) + (+this.position[1]-1);
			var diagonalRight = String.fromCharCode(thisLetterASCII-1) + (+this.position[1]-1);
			if(this.position[1] == "7"){
				var plusTwo = this.position[0]+(+this.position[1]-2);
			}
			var enemy = "white";
	}
	if (board.hasOwnProperty(plusOne) && board[plusOne] == null){
			possibleMovesArr.push(plusOne);
			if(plusTwo != undefined && board[plusTwo] == null)
				possibleMovesArr.push(plusTwo);				
	}

	if(board.hasOwnProperty(diagonalLeft) && board[diagonalLeft] != null && board[diagonalLeft].color == enemy){
			possibleMovesArr.push(diagonalLeft);
	}
	if(board.hasOwnProperty(diagonalRight) && board[diagonalRight] != null &&board[diagonalRight].color == enemy){
			possibleMovesArr.push(diagonalRight);
	}
	if((this.position[1] == "5" && enemy == "black") || (this.position[1] == "4" && enemy == "white") && board.playedPiece.type == "pawn"){
		if (enemy == "black"){
			var enPassantA = String.fromCharCode(thisLetterASCII-1) + "7" + String.fromCharCode(thisLetterASCII-1) + "5";
			var enPassantB = String.fromCharCode(thisLetterASCII+1) + "7" + String.fromCharCode(thisLetterASCII+1) + "5";
		}else{
			var enPassantA = String.fromCharCode(thisLetterASCII-1) + "2" + String.fromCharCode(thisLetterASCII-1) + "4";
			var enPassantB = String.fromCharCode(thisLetterASCII+1) + "2" + String.fromCharCode(thisLetterASCII+1) + "4";
		}
		if(board.playedMove == enPassantA || board.playedMove == enPassantB){
			if(enemy == "black")
				possibleMovesArr.push(board.playedMove[0]+"6");
			else
				possibleMovesArr.push(board.playedMove[0]+"3");
		}
	}
	alert(possibleMovesArr);
}

//Rook constructor
function Rook(position,color){
	Piece.call(this, position, color);
	this.type = "rook";
	this.image = "rook-"+color+".png";
}
Rook.prototype = Object.create(Piece.prototype);

//Knight constructor
function Knight(position,color){
	Piece.call(this, position, color);
	this.type = "knight";
	this.image = "knight-"+color+".png";
}
Knight.prototype = Object.create(Piece.prototype);

//Bishop constructor
function Bishop(position,color){
	Piece.call(this, position, color);
	this.type = "bishop";
	this.image = "bishop-"+color+".png";
}
Bishop.prototype = Object.create(Piece.prototype);

//Board constructor
function Board(canMove){
	this.canMove = canMove;
	this.isChecked = false;
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
			const pieceImg = "<div class='piece'><img src='"+this[squares[i]].image+"'</img></div>";
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
	this.playedMove = hash.playedMove;
	this.canCastleLeft = hash.canCastleLeft;
	this.canCastleRight = hash.canCastleRight;
	this.player = hash.player;
	for (var key in hash){
		if (key != "playedMove" && key != "canCastleLeft" && key != "canCastleRight" && key != "player")
			this[key] = pieceFactory(MAP[hash[key]][0], key, MAP[hash[key]][1]);
	}
	if(hash.hasOwnProperty("playedMove"))
		this.playedPiece = this[hash.playedMove[0]+hash.playedMove[1]];

};
Board.prototype.possibleMoves = function(square){

	this[square].possibleMoves(this);
}
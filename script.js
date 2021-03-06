"use strict";

const columns = "abcdefgh".split("");
const rows = "12345678".split("");
const ANIMATION_SPEED = 500;
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
	a8: "Rb",b8: "Nb", c8: "Bb", d8: "Qb", e8: "Kb", f8: "Bb", g8: "Nb", h8: "Rb", canShortCastle: true, canLongCastle: true, player: "white"
};
//@todo: delete this
const testPosition = {
	
	a4: "b", c7: "b", d7: "b", e7: "b", f7: "b", g7: "b", h7: "b", b4: "w",
	a1: "Rw",d4: "Bw", d2: "Qw", e1: "Kw", f1: "Bw", g1: "Nw", e4: "Rw", 
	a8: "Rb",c6: "Nb", c8: "Bb", d8: "Qb", e8: "Kb", h8: "Rb",
	playedMove: "e8g8", canShortCastle: true, canLongCastle: true, player: "white"
};

$('document').ready(function(){
	var position = testPosition;
	generateBoard(columns, rows, (position.player == "white"));
	var board = new Board(true);
	board.map(position);
	board.draw();
	console.log(board.isSquareAttacked("b5"));
	$(".draggable").draggable({ revert: "invalid" });
	$(".droppable").droppable({drop: function( event, ui ) {
		//remove yellow highlight from squares
		$("#"+board.playedMove[0]+board.playedMove[1]).removeAttr( 'style' );
		$("#"+board.playedMove[2]+board.playedMove[3]).removeAttr( 'style' );

    board.playedMove = $(ui.draggable).parent().attr("id") + $( this ).attr("id");
    board.canMove = false;
    board.draw();
      }, accept: function(draggable){
 				
 				if(board.isChecked && board[$(draggable).parent().attr("id")].type != "king"){
 					return false;
 				}
      	var possibleMovesArr = board.possibleMoves($(draggable).parent().attr("id"));
      	// console.log(possibleMovesArr);
      	for(let i = 0; i < possibleMovesArr.length; i++){
      		if($(this).attr("id") == possibleMovesArr[i])
      			return true;
      	}
      	return false;
      }});
});


//Functions and Objects
//Create div of square
function generateSquare(letter, number, color){
	const element = "<div class = 'droppable square " + color + "' id='" + letter + number + "'></div>";
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

King.prototype.possibleMoves = function(board){
	var candidateSquares = surroundingSquares(this.position);
	var possibleMovesArr = [];
	for(let i = 0; i < candidateSquares.length; i++){
		console.log(candidateSquares);
		if (!board.isSquareAttacked(candidateSquares[i]))
			possibleMovesArr.push(candidateSquares[i]);
	}

	if (this.canShortCastle(board))
		possibleMovesArr.push(String.fromCharCode(this.position.charCodeAt(0)+2) + this.position[1]);
	if (this.canLongCastle(board))
		possibleMovesArr.push(String.fromCharCode(this.position.charCodeAt(0)-2) + this.position[1]);
	return possibleMovesArr;
}

King.prototype.canShortCastle = function(board){
	var thisLetterASCII = this.position.charCodeAt(0);
	var thisNumber = this.position[1];
	var kingSideSquare = String.fromCharCode(thisLetterASCII+1) + thisNumber;
	var rookSideSquare = String.fromCharCode(thisLetterASCII+2) + thisNumber;

	return board[kingSideSquare] == null && board[rookSideSquare] == null && !board.isSquareAttacked(kingSideSquare) && !board.isSquareAttacked(rookSideSquare);
}
King.prototype.canLongCastle = function(board){
	var thisLetterASCII = this.position.charCodeAt(0);
	var thisNumber = this.position[1];
	var kingSideSquare = String.fromCharCode(thisLetterASCII-1) + thisNumber;
	var middleSquare = String.fromCharCode(thisLetterASCII-2) + thisNumber;
	var rookSideSquare = String.fromCharCode(thisLetterASCII-3) + thisNumber;

	return board[middleSquare] == null && board[kingSideSquare] == null && board[rookSideSquare] == null && 
		!board.isSquareAttacked(kingSideSquare) && !board.isSquareAttacked(middleSquare) && !board.isSquareAttacked(rookSideSquare);
}

//Queen Constructor
function Queen(position,color){
	Piece.call(this, position, color);
	this.type = "queen";
	this.image = "queen-"+color+".png";
}
Queen.prototype = Object.create(Piece.prototype);

Queen.prototype.possibleMoves = function(board){
	var bishop = new Bishop(this.position, this.color);
	var rook = new Rook(this.position, this.color);
	return $.merge( bishop.possibleMoves(board), rook.possibleMoves(board) );
}

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
	return possibleMovesArr;
}

//Rook constructor
function Rook(position,color){
	Piece.call(this, position, color);
	this.type = "rook";
	this.image = "rook-"+color+".png";
}
Rook.prototype = Object.create(Piece.prototype);

Rook.prototype.possibleMoves = function(board){
	var possibleMovesArr = [];
	var thisLetterASCII = this.position.charCodeAt(0);
	var thisLetter = this.position[0];
	var thisNumber = this.position[1];

	for(let i = +thisNumber + 1; i <= 8; i++ ){
		var pos = thisLetter + i;
		if( board[pos] == null ){
			possibleMovesArr.push(pos);
		}else{
			if(board[pos].color != this.color)
				possibleMovesArr.push(pos);
			break;
		}
	}

	for(let i = +thisNumber - 1; i > 0 ; i-- ){
		var pos = thisLetter + i;
		if( board[pos] == null ){
			possibleMovesArr.push(pos);
		}else{
			if(board[pos].color != this.color)
				possibleMovesArr.push(pos);
			break;
		}
	}

	for(let i = thisLetterASCII + 1; i <= "h".charCodeAt(0); i++ ){
		var pos = String.fromCharCode(i) + thisNumber;
		if( board[pos] == null ){
			possibleMovesArr.push(pos);
		}else{
			if(board[pos].color != this.color)
				possibleMovesArr.push(pos);
			break;
		}
	}

	for(let i = thisLetterASCII - 1; i >= "a".charCodeAt(0); i-- ){
		var pos = String.fromCharCode(i) + thisNumber;
		if( board[pos] == null){
			possibleMovesArr.push(pos);
		}else{
			if(board[pos].color != this.color)
				possibleMovesArr.push(pos);
			break;
		}
	}
	return possibleMovesArr;
}

//Knight constructor
function Knight(position,color){
	Piece.call(this, position, color);
	this.type = "knight";
	this.image = "knight-"+color+".png";
}
Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.possibleMoves = function(){
	var thisLetterASCII = this.position.charCodeAt(0);
	var thisNumber = this.position[1];
	var possibleMovesArr = [ 
		String.fromCharCode(thisLetterASCII+1) + (+thisNumber+2),
		String.fromCharCode(thisLetterASCII+1) + (+thisNumber-2),
		String.fromCharCode(thisLetterASCII-1) + (+thisNumber+2),
		String.fromCharCode(thisLetterASCII-1) + (+thisNumber-2),
		String.fromCharCode(thisLetterASCII+2) + (+thisNumber+1),
		String.fromCharCode(thisLetterASCII+2) + (+thisNumber-1),
		String.fromCharCode(thisLetterASCII-2) + (+thisNumber+1),
		String.fromCharCode(thisLetterASCII-2) + (+thisNumber-1)
	]
	return possibleMovesArr;
}

//Bishop constructor
function Bishop(position,color){
	Piece.call(this, position, color);
	this.type = "bishop";
	this.image = "bishop-"+color+".png";
}
Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.possibleMoves = function(board){
	var possibleMovesArr = [];
	var thisLetterASCII = this.position.charCodeAt(0);
	var thisLetter = this.position[0];
	var thisNumber = this.position[1];

	var i = +thisNumber + 1;
	var j = thisLetterASCII + 1;
	for(; i <= 8 && j <= "h".charCodeAt(0); i++, j++ ){
		var pos = String.fromCharCode(j) + i;
		if( board[pos] == null ){
			possibleMovesArr.push(pos);
		}else{
			if(board[pos].color != this.color)
				possibleMovesArr.push(pos);
			break;
		}
	}

	i = +thisNumber + 1;
	j = thisLetterASCII - 1;
	for(; i <= 8 && j >= "a".charCodeAt(0); i++, j-- ){
		var pos = String.fromCharCode(j) + i;

		if( board[pos] == null ){
			possibleMovesArr.push(pos);
		}else{
			if(board[pos].color != this.color)
				possibleMovesArr.push(pos);
			break;
		}
	}

	i = +thisNumber - 1;
	j = thisLetterASCII + 1;
	for(; i >= 1 && j <= "h".charCodeAt(0); i--, j++ ){
		var pos = String.fromCharCode(j) + i;
		// console.log(pos);

		if( board[pos] == null ){
			possibleMovesArr.push(pos);
		}else{
			if(board[pos].color != this.color)
				possibleMovesArr.push(pos);
			break;
		}
	}

	i = +thisNumber - 1;
	j = thisLetterASCII - 1;
	for(; i >= 0 && j >= "a".charCodeAt(0); i--, j-- ){
		var pos = String.fromCharCode(j) + i;
		if( board[pos] == null ){
			possibleMovesArr.push(pos);
		}else{
			if(board[pos].color != this.color)
				possibleMovesArr.push(pos);
			break;
		}
	}
	return possibleMovesArr;
}

//Board constructor
function Board(canMove){
	this.canMove = canMove;
	this.isChecked = false;
	this.nullify();
}
Board.prototype.map = function(hash){
	const MAP = {
		"w": ["Pawn","white"], "b": ["Pawn","black"], "Rw": ["Rook","white"],"Rb": ["Rook","black"],
		"Nw": ["Knight","white"], "Nb": ["Knight","black"], "Bw": ["Bishop","white"],"Bb": ["Bishop","black"],
		"Kw": ["King","white"], "Kb": ["King","black"], "Qw": ["Queen","white"],"Qb": ["Queen","black"]
	};
	var myKing;
	this.nullify();
	this.playedMove = hash.playedMove;
	this.canShortCastle = hash.canShortCastle;
	this.canLongCastle = hash.canLongCastle;
	this.player = hash.player;
	for (var key in hash){
		if (key != "playedMove" && key != "canShortCastle" && key != "canLongCastle" && key != "player"){
			this[key] = pieceFactory(MAP[hash[key]][0], key, MAP[hash[key]][1]);
			if(MAP[hash[key]][0] == "King" && MAP[hash[key]][1] == this.player)
				myKing = key;
		}
	}
	if(hash.hasOwnProperty("playedMove")){
		this.playedPiece = this[hash.playedMove[0]+hash.playedMove[1]];
	}
	if(this.isSquareAttacked(myKing)){
		this.isChecked = true;
	}
};
Board.prototype.nullify = function(){
	for(let i = 0; i<squares.length; i++)
		eval("this."+squares[i]+"=null");
}

Board.prototype.draw = function() {
	for(let i = 0; i<squares.length; i++){
		$("#"+squares[i]).empty();
		if(this[squares[i]] != null){
			if(this[squares[i]].color != this.player || !this.canMove){
				var pieceImg = "<div class='piece'><img src='"+this[squares[i]].image+"'</img></div>";
			}
			else{
				var pieceImg = "<div class='piece draggable'><img src='"+this[squares[i]].image+"'</img></div>";
				if(this.playedMove == null || squares[i] != this.playedMove[2]+this.playedMove[3]){
					$("#"+squares[i]).removeClass("droppable");
				}
			}
			$("#"+squares[i]).append(pieceImg);	
		}
	}
	if(this.playedMove != null){
		var startingPosition = this.playedMove[0]+this.playedMove[1];
		var destination = this.playedMove[2]+this.playedMove[3];
		var playedPiece = this[startingPosition].type;
		$("#"+startingPosition).css("background-color","yellow");
		$("#"+destination).css("background-color","yellow");

		if(this.canMove){
			var x = $("#"+destination).offset().left-$("#"+startingPosition).offset().left;
			var y = $("#"+destination).offset().top-$("#"+startingPosition).offset().top;
			$("#"+startingPosition+" div").animate({left: x, top: y},ANIMATION_SPEED,function(){
				$("#"+destination).empty();
				$(this).appendTo("#"+destination);
				$(this).removeAttr( 'style' );
			});
			if (this[startingPosition].type == "pawn"){

			}else if(this[startingPosition].king == "pawn"){

			}
		}else{
			$("#"+destination).empty();
			$("#"+startingPosition+" div").appendTo("#"+destination);
		}

		if (playedPiece == "king" && Math.abs(startingPosition.charCodeAt(0)-destination.charCodeAt(0)) > 1){
    	var rookLocation;
    	var newRookLocation;
    	if(destination[0] == "c"){
    		rookLocation = "a" + startingPosition[1];
    		newRookLocation = "d" + startingPosition[1];
    	}
    	else{
    		rookLocation = "h" + startingPosition[1];
    		newRookLocation = "f" + startingPosition[1];

    	}
    	$("#"+rookLocation+" div").appendTo("#"+newRookLocation);
    	this[newRookLocation] = this[rookLocation];

    	this[rookLocation] = null;
    	$("#"+rookLocation).empty();
    }else if(playedPiece == "pawn" && startingPosition.charCodeAt(0)-destination.charCodeAt(0) != 0 && board[destination[0]+destination[1]] == null ){
    	var pawnLocation = destination[0]+startingPosition[1];
    	this[pawnLocation] = null;
    	$("#"+pawnLocation).empty().addClass("droppable");;
    }


		this[startingPosition] = null;
		this[destination] = this.playedPiece;
	}
};

Board.prototype.possibleMoves = function(square){

	if (this[square] == null)
		return [];
	return this[square].possibleMoves(this);
}

Board.prototype.isSquareAttacked = function(square){

	console.log(square);
	var dummyKnight = new Knight(square, "white"); //color doesn't matter
	var knightAttacks = dummyKnight.possibleMoves();

	for(let i=0; i< knightAttacks.length; i++){
		var piece = this[knightAttacks[i]];
		if(piece != null && piece.color != this.player && piece.type === "knight")
			return true;
	}

	var dummyBishop = new Bishop(square,this.player);
	var bishopQueenAttacks =  dummyBishop.possibleMoves(this);

	for(let i=0; i< bishopQueenAttacks.length; i++){
		var piece = this[bishopQueenAttacks[i]];
		if(piece != null && piece.color != this.player && (piece.type === "bishop" || piece.type === "queen"))
			return true;
	}

	var dummyRook = new Rook(square,this.player);
	var rookQueenAttacks =  dummyRook.possibleMoves(this);

	for(let i=0; i< rookQueenAttacks.length; i++){
		var piece = this[rookQueenAttacks[i]];
		if(piece != null && piece.color != this.player && (piece.type === "rook" || piece.type === "queen"))
			return true;
	}

	var dummyPawn = new Pawn(square,this.player);
	var pawnAttacks =  dummyPawn.possibleMoves(this);

	for(let i=0; i< pawnAttacks.length; i++){
		var piece = this[pawnAttacks[i]];
		if(piece != null && piece.color != this.player && piece.type === "pawn" && piece.position[0] != square[0])
			return true;
	}
	var thisLetter = square[0];
	var thisNumber = square[1];
	var thisLetterASCII = square.charCodeAt(0);
	var kingMoves = surroundingSquares(square);

	for(let i=0; i < kingMoves.length; i++){
		var piece = this[kingMoves[i]];
		if(piece != null && piece.color != this.player && piece.type === "king")
			return true;
	}

	return false;
}

function surroundingSquares(position){
	var thisLetterASCII = position.charCodeAt(0);
	var thisNumber = position[1];
	var tempSquares = [
		String.fromCharCode(thisLetterASCII+1)+thisNumber,
		String.fromCharCode(thisLetterASCII-1)+thisNumber,
		String.fromCharCode(thisLetterASCII)+(+thisNumber+1),
		String.fromCharCode(thisLetterASCII)+(+thisNumber-1),
		String.fromCharCode(thisLetterASCII+1)+(+thisNumber+1),
		String.fromCharCode(thisLetterASCII+1)+(+thisNumber-1),
		String.fromCharCode(thisLetterASCII-1)+(+thisNumber+1),
		String.fromCharCode(thisLetterASCII-1)+(+thisNumber-1)
		];
	var result = [];
	for(let i=0; i<tempSquares.length; i++){
		if(isLegalPosition(tempSquares[i]))
			result.push(tempSquares[i]);
	}
	return result;
}

function isLegalPosition(position){
	try {
		var thisLetterASCII = position.charCodeAt(0);
		var thisNumber = position[1];
		return !(thisLetterASCII > "h".charCodeAt(0) || thisLetterASCII < "a".charCodeAt(0) || thisNumber > 8 || thisNumber < 1);
	}catch(err){
		return false;
	}
}


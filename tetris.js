var block = []

var colors = ['#7CFC00','#FFA500','#DC143C','#0FF','#FF0']

var gameInterval
var moveInterval

var direction

var score = 0

function randInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}

function closeStartWindow(){

	setTimeout(spawnBlock, 100)
	gameInterval = setInterval(moveDown, 500)

	document.getElementById("start-window").style.top     = "-100%"
	document.getElementById("start-window").style.opacity = "0"

	setTimeout(function(){
		document.getElementById("start-window").style.display = "none"
	},1000);

	startTime = new Date()

	window.ontouchend = function(){
		direction = null
	}

	window.onkeyup = function(){
		direction = null
	}

	window.onkeydown = function(event){
		if (event.keyCode == 27) restart()
		if (event.keyCode == 37) direction = 'left'
		if (event.keyCode == 38) rotate()
		if (event.keyCode == 39) direction = 'right'
		if (event.keyCode == 40) direction = 'down'
	}

	setInterval(function(){
		if (direction){
			if (direction == 'left') left()
			if (direction == 'right') right()
			if (direction == 'down') moveDown()
		}
	}, 70)
}

function openSettingsWindow(){
	document.getElementById('settings-window').style.left = 0
}
function closeSettingsWindow(){
	document.getElementById('settings-window').style.left = '-100%'
}

canvas = document.getElementById('tetris-canvas')
ctx    = canvas.getContext('2d')

function init(){
	w = canvas.width  = canvas.style.width  = window.innerWidth
	h = canvas.height = canvas.style.height = window.innerHeight

	maxRows    = ~~((w-32)/32)
	maxColumns = ~~((h-64)/32) - 1

	document.getElementById('field-width').max  = maxRows
	document.getElementById('field-height').max = maxColumns

	rows    = document.getElementById('field-width' ).value
	columns = document.getElementById('field-height').value

	leftSide = ~~((maxRows-rows)/2)
}
init()

function drawGrid(){

	w = canvas.width  = canvas.style.width  = window.innerWidth
	h = canvas.height = canvas.style.height = window.innerHeight

	if (rows > maxRows) rows = maxRows
	if (columns > maxColumns) columns = maxColumns

	leftSide = ~~((maxRows-rows)/2)

	for (i = 0; i < block.length; i++){
		ctx.clearRect(block[i].x+1, block[i].y+1, 30, 30)
	}

	ctx.strokeStyle = '#444'

	for (y = 16;  y < columns*32; y += 32){
		for (x = leftSide*32+16; x < leftSide*32+16 + rows*32; x += 32){
			ctx.strokeRect(x, y, 32, 32)
		}
	}
}
drawGrid()

window.onresize = function(){
	setTimeout(init, 600)
	setTimeout(drawGrid, 1000)
}

function drawBlocks(){
	drawGrid()

	maxX = 0
	minX = leftSide + rows

	for (i = 0; i < block.length; i++){
		if (block[i].x > maxX) maxX = block[i].x
		if (block[i].x < minX) minX = block[i].x

		drawX = block[i].x * 32 + 17
		drawY = block[i].y * 32 + 17

		ctx.fillStyle = color
		ctx.fillRect(drawX, drawY, 30, 30)
	}

	maxX++

	ctx.moveTo(minX*32+16, 16)
	ctx.lineTo(minX*32+16, columns*32+16)

	ctx.moveTo(maxX*32+16, 16)
	ctx.lineTo(maxX*32+16, columns*32+16)


	ctx.strokeStyle = '#666'

	ctx.stroke()

	if (stoppedBlocks.length > 0){
		for (i = 0; i < stoppedBlocks.length; i++){
			drawX = stoppedBlocks[i].x * 32 + 17
			drawY = stoppedBlocks[i].y * 32 + 17

			ctx.fillStyle = stoppedBlocks[i].color
			ctx.fillRect(drawX, drawY, 30, 30)
		}
	}
	printScore()
	drawNextFigure()
	drawSpentTime()
}

stoppedBlocks = []

function moveDown(){
	for (i = 0; i < block.length; i++){
		for (j = 0; j < stoppedBlocks.length; j++){
			if (block[i].y+1 == stoppedBlocks[j].y && block[i].x == stoppedBlocks[j].x) {
				for (n = 0; n < block.length; n++){
					stoppedBlocks.push({
						x: block[n].x,
						y: block[n].y,
						color: color
					})
				}
				block = []
				drawBlocks()
				checkCompletedLines()
				spawnBlock()
				return
			}
		}
	}

	for (i = 0; i < block.length; i++){
		if (block[i].y >= columns-1) {
			for (n = 0; n < block.length; n++){
				stoppedBlocks.push({
					x: block[n].x,
					y: block[n].y,
					color: color
				})
			}
			block = []
			checkCompletedLines()
			spawnBlock()
		}
	}

	for (i = 0; i < block.length; i++){
		if (block[i].y < columns-1) {
			block[i].y++
		}
	}
	drawBlocks()
}

function checkCompletedLines(){
for (i = columns-1; i >= 0; i--){
	count = 0

	for (j = 0; j < stoppedBlocks.length; j++){
		if (stoppedBlocks[j].y == i) count++
	}
	if (count > 0 && i == 0) {
		document.getElementById('result-window').style.top = 0
		document.getElementById('result-window-text').innerHTML = 'You lose'
		spentTime = new Date - startTime
		document.getElementById('spent-time').innerHTML = '<br>Spented time: '+((~~(spentTime/60000)%60).toString())+':'+((~~(spentTime/1000)%60).toString())+'<br><br>Score: '+score
		direction = null
		clearInterval(gameInterval)
	}

	if (count >= rows) {
		score++
		for (j = 0; j < stoppedBlocks.length; j++){
			if (stoppedBlocks[j].y == i){
				stoppedBlocks.splice(j, 1)
				j--
			}
			else if (stoppedBlocks[j].y < i){
				stoppedBlocks[j].y++
			}
		}
		i++
	}
}
}

function left(){
for (i = 0; i < block.length; i++){
	if (block[i].x == leftSide) return
	for (j = 0; j < stoppedBlocks.length; j++){
		if (block[i].x-1 == stoppedBlocks[j].x && block[i].y == stoppedBlocks[j].y){
			return
		}
	}
}
for (i = 0; i < block.length; i++){
	block[i].x--
}
drawBlocks()
}

function right(){
for (i = 0; i < block.length; i++){
	if (block[i].x*32 + 32 >= parseInt(leftSide)*32 + parseInt(rows)*32) return
	for (j = 0; j < stoppedBlocks.length; j++){
		if (block[i].x+1 == stoppedBlocks[j].x && block[i].y == stoppedBlocks[j].y){
			return
		}
	}
}
for (i = 0; i < block.length; i++){
	block[i].x++
}
drawBlocks()
}

nextFigureType = randInt(0, 7)

function spawnBlock(){
if (block.length == 0){

	if (colors.length == 0) colors = ['#7CFC00','#FFA500','#DC143C','#0FF','#FF0']

	numberOfColor = randInt(0,colors.length)

	color = colors[numberOfColor]
	colors.splice(numberOfColor, 1)

	figureType = nextFigureType

	nextFigureType = randInt(0, 7)

	if (figureType == 0) block.push({x: ~~(leftSide+rows/2),  y: 0}, {x: ~~(leftSide+rows/2)+1,y: 0}, {x: ~~(leftSide+rows/2),y: 1}, {x: ~~(leftSide+rows/2)+1,y: 1})
	else if (figureType == 1) block.push({x: ~~(leftSide+rows/2)-1,y: 0, rotate: 0}, {x: ~~(leftSide+rows/2),y: 0}, {x: ~~(leftSide+rows/2)+1,y: 0}, {x: ~~(leftSide+rows/2)+2,y: 0})
	else if (figureType == 2) block.push({x: ~~(leftSide+rows/2),y: 1, rotate: 0}, {x: ~~(leftSide+rows/2)-1,y: 1}, {x: ~~(leftSide+rows/2)+1,y: 1}, {x: ~~(leftSide+rows/2)-1,y: 0})
	else if (figureType == 3) block.push({x: ~~(leftSide+rows/2),y: 1, rotate: 0}, {x: ~~(leftSide+rows/2)-1,y: 1}, {x: ~~(leftSide+rows/2)+1,y: 1}, {x: ~~(leftSide+rows/2)+1,y: 0})
	else if (figureType == 4) block.push({x: ~~(leftSide+rows/2),y: 1, rotate: 0}, {x: ~~(leftSide+rows/2)+1,y: 1}, {x: ~~(leftSide+rows/2),y: 0}, {x: ~~(leftSide+rows/2)-1,y: 0})
	else if (figureType == 5) block.push({x: ~~(leftSide+rows/2),y: 1, rotate: 0}, {x: ~~(leftSide+rows/2)-1,y: 1}, {x: ~~(leftSide+rows/2),y: 0}, {x: ~~(leftSide+rows/2)+1,y: 0})
	else if (figureType == 6) block.push({x: ~~(leftSide+rows/2),y: 1, rotate: 0}, {x: ~~(leftSide+rows/2)+1,y: 1}, {x: ~~(leftSide+rows/2)-1,y: 1}, {x: ~~(leftSide+rows/2),y: 0})
	drawBlocks()
}
}

function rotate(){
point = block[0]
if (figureType == 0){
	return
}
else if (figureType == 1){
	if (point.rotate == 0) newBlock = [{x: point.x, y: point.y, rotate: 1}, {x: point.x, y: point.y+1}, {x: point.x, y: point.y+2}, {x: point.x, y: point.y+3}]
	else newBlock = [{x: point.x, y: point.y, rotate: 0}, {x: point.x+1, y: point.y}, {x: point.x+2, y: point.y}, {x: point.x+3, y: point.y}]
}
else if (figureType == 2){
	if (point.rotate == 0) newBlock = [{x: point.x, y: point.y, rotate: 1}, {x: point.x, y: point.y-1}, {x: point.x+1, y: point.y-1}, {x: point.x, y: point.y+1}]
	else if (point.rotate == 1) newBlock = [{x: point.x, y: point.y, rotate: 2}, {x: point.x+1, y: point.y}, {x: point.x+1, y: point.y+1}, {x: point.x-1, y: point.y}]
	else if (point.rotate == 2) newBlock = [{x: point.x, y: point.y, rotate: 3}, {x: point.x, y: point.y+1}, {x: point.x, y: point.y-1}, {x: point.x-1, y: point.y+1}]
	else if (point.rotate == 3) newBlock = [{x: point.x, y: point.y, rotate: 0}, {x: point.x-1, y: point.y}, {x: point.x-1, y: point.y-1}, {x: point.x+1, y: point.y}]
}
else if (figureType == 3){
	if (point.rotate == 0) newBlock = [{x: point.x, y: point.y, rotate: 1}, {x: point.x, y: point.y+1}, {x: point.x, y: point.y-1}, {x: point.x+1, y: point.y+1}]
	else if (point.rotate == 1) newBlock = [{x: point.x, y: point.y, rotate: 2}, {x: point.x-1, y: point.y}, {x: point.x-1, y: point.y+1}, {x: point.x+1, y: point.y}]
	else if (point.rotate == 2) newBlock = [{x: point.x, y: point.y, rotate: 3}, {x: point.x, y: point.y+1}, {x: point.x, y: point.y-1}, {x: point.x-1, y: point.y-1}]
	else if (point.rotate == 3) newBlock = [{x: point.x, y: point.y, rotate: 0}, {x: point.x-1, y: point.y}, {x: point.x+1, y: point.y-1}, {x: point.x+1, y: point.y}]
}
else if (figureType == 4){
	if (point.rotate == 0) newBlock = [{x: point.x, y: point.y, rotate: 1}, {x: point.x, y: point.y+1}, {x: point.x+1, y: point.y}, {x: point.x+1, y: point.y-1}]
	else newBlock = [{x: point.x, y: point.y, rotate: 0}, {x: point.x-1, y: point.y}, {x: point.x, y: point.y+1}, {x: point.x+1, y: point.y+1}]
}
else if (figureType == 5){
	if (point.rotate == 0) newBlock = [{x: point.x, y: point.y, rotate: 1}, {x: point.x, y: point.y-1}, {x: point.x+1, y: point.y}, {x: point.x+1, y: point.y+1}]
	else newBlock = [{x: point.x, y: point.y, rotate: 0}, {x: point.x-1, y: point.y}, {x: point.x, y: point.y-1}, {x: point.x+1, y: point.y-1}]
}
else if (figureType == 6){
	if (point.rotate == 0) newBlock = [{x: point.x, y: point.y, rotate: 1}, {x: point.x+1, y: point.y}, {x: point.x, y: point.y-1}, {x: point.x, y: point.y+1}]
	else if (point.rotate == 1) newBlock = [{x: point.x, y: point.y, rotate: 2}, {x: point.x-1, y: point.y}, {x: point.x+1, y: point.y}, {x: point.x, y: point.y+1}]
	else if (point.rotate == 2) newBlock = [{x: point.x, y: point.y, rotate: 3}, {x: point.x-1, y: point.y}, {x: point.x, y: point.y+1}, {x: point.x, y: point.y-1}]
	else if (point.rotate == 3) newBlock = [{x: point.x, y: point.y, rotate: 0}, {x: point.x-1, y: point.y}, {x: point.x+1, y: point.y}, {x: point.x, y: point.y-1}]
}

for (i = 0; i < 4; i++){
	if (newBlock[i].x < leftSide || newBlock[i].x >= parseInt(leftSide) + parseInt(rows)) return
	for (j = 0; j < stoppedBlocks.length; j++){
		if (newBlock[i].x == stoppedBlocks[j].x && newBlock[i].y == stoppedBlocks[j].y) {
			return
		}
	}
}
block = newBlock
drawBlocks()
}

function printScore(){
ctx.clearRect(16, h-60, 150, 30)
ctx.fillStyle = '#FFF'
ctx.font = '30px Arial'
ctx.fillText('Score: '+score+'/50', 16, h-36)

if (score >= 50){
	document.getElementById('result-window').style.top = 0
	document.getElementById('result-window-text').innerHTML = 'You win!'
	spentTime = new Date - startTime
	document.getElementById('spent-time').innerHTML = '<br>Spented time: '+((~~(spentTime/60000)%60).toString())+':'+((~~(spentTime/1000)%60).toString())
	direction = null
	clearInterval(gameInterval)
}
}
printScore()

function drawNextFigure(){
ctx.strokeRect(w-96, h-80, 80, 64);
if (nextFigureType == 0){
	ctx.fillStyle = '#FFF'
	ctx.fillRect(w-72, h-64, 32, 32)
}
else if (nextFigureType == 1){
	ctx.fillStyle = '#FFF'
	ctx.fillRect(w-88, h-56, 64, 16)
}
else if (nextFigureType == 2){
	ctx.fillStyle = '#FFF'
	ctx.fillRect(w-80, h-48, 48, 16)
	ctx.fillRect(w-80, h-64, 16, 16)
}
else if (nextFigureType == 3){
	ctx.fillStyle = '#FFF'
	ctx.fillRect(w-80, h-48, 48, 16)
	ctx.fillRect(w-48, h-64, 16, 16)
}
else if (nextFigureType == 4){
	ctx.fillStyle = '#FFF'
	ctx.fillRect(w-64, h-48, 32, 16)
	ctx.fillRect(w-80, h-64, 32, 16)
}
else if (nextFigureType == 5){
	ctx.fillStyle = '#FFF'
	ctx.fillRect(w-80, h-48, 32, 16)
	ctx.fillRect(w-64, h-64, 32, 16)
}
else if (nextFigureType == 6){
	ctx.fillStyle = '#FFF'
	ctx.fillRect(w-80, h-48, 48, 16)
	ctx.fillRect(w-64, h-64, 16, 16)
}

}
drawNextFigure()

function drawSpentTime(){
spentTime = new Date - startTime
 ctx.clearRect(w/2-50, h-60, 100, 30)
 ctx.fillText(((~~(spentTime/60000)%60).toString())+':'+((~~(spentTime/1000)%60).toString()), w/2, h-36)    
}

function restart(){
document.getElementById('result-window').style.top = '-100%'
stoppedBlocks = []
block = []
startTime = new Date()
init()
score = 0
spawnBlock()
clearInterval(gameInterval)
gameInterval = setInterval(moveDown, 500)
}

document.getElementById('tetris-canvas').addEventListener('touchstart', handleTouchStart)
document.getElementById('tetris-canvas').addEventListener('touchmove', handleTouchMove)

function handleTouchStart(event){
firstTouch = event.touches[0]
xDown = firstTouch.clientX
yDown = firstTouch.clientY
}

function handleTouchMove(event){
if (!xDown || !yDown) return
var xUp = event.touches[0].clientX
var yUp = event.touches[0].clientY
var xDifferent = xDown - xUp
var yDifferent = yDown - yUp
if ( Math.abs(xDifferent) > Math.abs(yDifferent)) {
	if ( xDifferent > 0 ) {
		direction = 'left'
	}
	else {
		direction = 'right'
	}
} 
else {
	if ( yDifferent > 0 ) rotate()
	else {
		direction = 'down'
	}
}
xDown = null
yDown = null
}
// canvas setup
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreContainer = document.querySelector('#scoreContainer')
const scoreEl = document.querySelector('#scoreEl')
const endScoreEl = document.querySelector('#endScoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const startGameContainer = document.querySelector('#startGameContainer')

// variables
const GAME_SPEED = 60
const GRAVITY = 1
const dieSoundEffect = new Audio('Media/die-sound-effect.mp3')
const scoreSoundEffect = new Audio('Media/point-sound-effect.mp3')
const flapSoundEffect = new Audio('Media/flap-sound-effect.mp3')
const hitSoundEffect = new Audio ('Media/hit-sound-effect.mp3')
const swooshSoundEffect = new Audio ('Media/swoosh-sound-effect.mp3')
dieSoundEffect.volume = 0.1
scoreSoundEffect.volume = 0.2
flapSoundEffect.volume = 0.2
hitSoundEffect.volume = 0.2
swooshSoundEffect.volume = 0.2

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    cancelAnimationFrame(animationId)
    scoreContainer.style.display = 'none'
    startGameContainer.style.display = 'flex'
})

// utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// objects
class Player {
    constructor(x, y, radius, color, velocity, flapStrength, isAlive) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.flapStrength = flapStrength
        this.isAlive = isAlive
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()

        // update velocity of player
        this.velocity.y += GRAVITY

        // update position
        this.y += this.velocity.y
    }
}
class Pipe {
    constructor(x, y, width, height, color, velocity, isPassed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.velocity = velocity
        this.isPassed = isPassed
    }

    draw() {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()

        // update position
        this.x += this.velocity.x
    }
}

// implementation
let player
let pipes
let score
let timer
let pipeSpawnSpeed
let pipeGap
let pointOnRect
let bgColor
let lastRenderTime

function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 30, '#ffdd1f', {y: 0}, -15, true)
    pipes = []
    score = 0
    pipeSpawnSpeed = 2000
    pipeGap = 205
    pointOnRect = {
        x: null,
        y: null,
    }
    bgColor = 255
    lastRenderTime = 0
    scoreEl.innerHTML = score
    scoreContainer.style.display = 'block'
    endScoreEl.innerHTML = score
    startGameContainer.style.display = 'none'
    clearInterval(timer)
}

function gameOver() {
    cancelAnimationFrame(animationId)
    clearInterval(timer)
    player.isAlive = false
    hitSoundEffect.play()
    setTimeout(() => {
        scoreContainer.style.display = 'none'
        endScoreEl.innerHTML = score
        startGameContainer.style.display = 'flex'
        swooshSoundEffect.play()
    }, 500)
}

function spawnPipes() {
    timer = setInterval(() => {
        const topPipe = {
            width: 90,
            height: canvas.height - pipeGap,
            x: canvas.width,
            y: -(canvas.height - pipeGap) * Math.random(),
            color: '#18770d',
            velocity: {x: -4.5}
        }
        const bottomPipe = {
            width: topPipe.width,
            height: topPipe.height,
            x: topPipe.x,
            y: topPipe.y + topPipe.height + pipeGap,
            color: topPipe.color,
            velocity: topPipe.velocity
        }

        pipes.push(new Pipe(topPipe.x, topPipe.y, topPipe.width, topPipe.height, topPipe.color, topPipe.velocity, false))
        pipes.push(new Pipe(bottomPipe.x, bottomPipe.y, bottomPipe.width, bottomPipe.height, bottomPipe.color, bottomPipe.velocity, false))
    }, pipeSpawnSpeed)
}

function clamp(min, max, value) {
    if (value < min) return min
    else if (value > max) return max
    else return value
}

// animation loop
let animationId
function animate(currentTime) {
    animationId = requestAnimationFrame(animate)

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < 1 / GAME_SPEED) return
    lastRenderTime = currentTime

    ctx.clearRect(0, 0, innerWidth, innerHeight)

    player.update()
    pipes.forEach((pipe, index) => {
        pipe.update()

        // increment score
        if (!pipe.isPassed && player.x > pipe.x +pipe.width) {
            score += 0.5
            scoreEl.innerHTML = score
            pipe.isPassed = true
            
            // play score sound effect
            scoreSoundEffect.play()
        }

        // player pipe collision
        pointOnRect.x = clamp(pipe.x, pipe.x + pipe.width, player.x)
        pointOnRect.y = clamp(pipe.y, pipe.y + pipe.height, player.y)
        if (Math.hypot(player.x - pointOnRect.x, player.y - pointOnRect.y) - player.radius <= 0) {
            gameOver()
            }

        // prevent player from going above pipes
        if (player.y - player.radius <= 0 && player.x + player.radius >= pipe.x) {
            gameOver()
        }

        // remove pipe when off screen
        if (pipe.x + pipe.width < 0) {
            setTimeout(() => {
                pipes.shift()
            }, 0)
        }
    })

    // player ground collision
    if (player.y + player.radius >= canvas.height) {
        gameOver()
    }
}

// flapping logic
addEventListener('click', () => {
    if (player.isAlive) {
        player.velocity.y = player.flapStrength
        flapSoundEffect.play()
    }
})

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnPipes()
    swooshSoundEffect.play()
})
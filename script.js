// canvas setup
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreContainer = document.querySelector('#scoreContainer')
const scoreEl = document.querySelector('#scoreEl')

// variables
const mouse = {
    x: undefined,
    y: undefined,
}
const GRAVITY = 0.1

// event listeners
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
    cancelAnimationFrame(animationId)
})

// utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// objects
class Player {
    constructor(x, y, radius, color, velocity, flapStrength) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.flapStrength = flapStrength
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
    constructor(x, y, width, height, color, velocity, passed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.velocity = velocity
        this.passed = passed
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

function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 35, '#ffdd1f', {y: 0}, -5)
    pipes = []
    score = 0
    pipeSpawnSpeed = 3000
    pipeGap = 350
    pointOnRect = {
        x: null,
        y: null,
    }
    scoreEl.innerHTML = score
}

function spawnPipes() {
    timer = setInterval(() => {
        const topPipe = {
            width: 90,
            height: canvas.height - pipeGap,
            x: canvas.width + 75,
            y: -(canvas.height - pipeGap) * Math.random(),
            color: '#18770d',
            velocity: {x: -1.5}
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
    if (value < min) {
        return min
    } else if (value > max) {
        return max
    } else {
        return value
    }
}

function gameOver() {
    cancelAnimationFrame(animationId)
}

// animation loop
let animationId
function animate() {
    animationId = requestAnimationFrame(animate)

    ctx.clearRect(0, 0, innerWidth, innerHeight)

    player.update()
    pipes.forEach((pipe, index) => {
        pipe.update()

        // increment score
        if (!pipe.passed && player.x > pipe.x +pipe.width) {
            score += 0.5
            scoreEl.innerHTML = score
            pipe.passed = true
            
            // play score sound effect
            const scoreSoundEffect = new Audio('Media/point-sound-effect.mp3')
            scoreSoundEffect.volume = 0.2
            scoreSoundEffect.play()
        }

        // player pipe collision
        pointOnRect.x = clamp(pipe.x, pipe.x + pipe.width, player.x)
        pointOnRect.y = clamp(pipe.y, pipe.y + pipe.height, player.y)
        if (Math.hypot(player.x - pointOnRect.x, player.y - pointOnRect.y) - player.radius <= 0) {
            gameOver()
        }
    })

    // player ground collision
    if (player.y + player.radius >= canvas.height) {
        gameOver()
    }
}

init()
animate()
spawnPipes()

// flapping logic
addEventListener('click', () => {
    player.velocity.y = player.flapStrength
})
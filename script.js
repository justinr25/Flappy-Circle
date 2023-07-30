// canvas setup
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// variables
const mouse = {
    x: undefined,
    y: undefined,
}

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
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
}
class Pipe {
    constructor(x, y, width, height, color, velocity) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = '#18770d'
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

function init() {
    player = new player()
    pipes = []
    pipeSpawnSpeed = 2000
}

function spawnPipes() {
    timer = setInterval(() => {

    }, pipeSpawnSpeed)
}

// animation loop
let animationId
function animate() {
    animationId = requestAnimationFrame(animate)

    ctx.clearRect(0, 0, innerWidth, innerHeight)

    for (let j = 0; j < pipes.length; j++) {
        pipes[j].update()
    }
}

init()
animate()
spawnPipes()
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

function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 40, '#ffdd1f', {y: 0}, -5)
    pipes = []
    pipeSpawnSpeed = 2000
}

function spawnPipes() {
    timer = setInterval(() => {
        const width = 60
        const height = canvas.height / 2
        const x = canvas.width + width
        const y = 0
        const color = '#18770d'
        const velocity = {x: -1.5}

        pipes.push(new Pipe(x, y, width, height, color, velocity))
    }, pipeSpawnSpeed)
}

// animation loop
let animationId
function animate() {
    animationId = requestAnimationFrame(animate)

    ctx.clearRect(0, 0, innerWidth, innerHeight)

    player.update()
    for (let j = 0; j < pipes.length; j++) {
        pipes[j].update()
    }
    console.log(pipes)
}

init()
animate()
spawnPipes()

// flapping logic
addEventListener('click', () => {
    player.velocity.y = player.flapStrength
})
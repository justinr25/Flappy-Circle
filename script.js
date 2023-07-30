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
})

// utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// objects
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
    }
}

// implementation
let pipes

function init() {
    pipes = []
    for (let j = 0; j < 50; j++) {
        pipes.push(new Pipe(x, y, dx, dy, radius))
    }
}

// animation loop
function animate() {
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, innerWidth, innerHeight)

    for (let j = 0; j < pipes.length; j++) {
        pipes[j].update()
    }
}

init()
animate()
let modalKey = 0
let quantcamisa = 1
let cart = []

const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.camisaWindowArea').style.opacity = 0
    seleciona('.camisaWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.camisaWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.camisaWindowArea').style.opacity = 0
    setTimeout(() => seleciona('.camisaWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    selecionaTodos('.camisaInfo--cancelButton, .camisaInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDascamisa = (camisaItem, item, index) => {
    camisaItem.setAttribute('data-key', index)
    camisaItem.querySelector('.camisa-item--img img').src = item.img
    camisaItem.querySelector('.camisa-item--price').innerHTML = formatoReal(item.price[2])
    camisaItem.querySelector('.camisa-item--name').innerHTML = item.name
    camisaItem.querySelector('.camisa-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.camisaBig img').src = item.img
    seleciona('.camisaInfo h1').innerHTML = item.name
    seleciona('.camisaInfo--desc').innerHTML = item.description
    seleciona('.camisaInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {
    let key = e.target.closest('.camisa-item').getAttribute('data-key')
    console.log('camisa clicada ' + key)
    console.log(camisaJson[key])

    quantcamisa = 1
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    seleciona('.camisaInfo--size.selected').classList.remove('selected')

    selecionaTodos('.camisaInfo--size').forEach((size, sizeIndex) => {
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = camisaJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    selecionaTodos('.camisaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            seleciona('.camisaInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')
            seleciona('.camisaInfo--actualPrice').innerHTML = formatoReal(camisaJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    seleciona('.camisaInfo--qtmais').addEventListener('click', () => {
        quantcamisa++
        seleciona('.camisaInfo--qt').innerHTML = quantcamisa
    })

    seleciona('.camisaInfo--qtmenos').addEventListener('click', () => {
        if(quantcamisa > 1) {
            quantcamisa--
            seleciona('.camisaInfo--qt').innerHTML = quantcamisa	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.camisaInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        console.log("camisa " + modalKey)
        let size = seleciona('.camisaInfo--size.selected').getAttribute('data-key')
        console.log("Tamanho " + size)
        console.log("Quant. " + quantcamisa)
        let price = seleciona('.camisaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        let identificador = camisaJson[modalKey].id+'t'+size

        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            cart[key].qt += quantcamisa
        } else {
            let camisa = {
                identificador,
                id: camisaJson[modalKey].id,
                size,
                qt: quantcamisa,
                price: parseFloat(price)
            }
            cart.push(camisa)
            console.log(camisa)
            console.log('Sub total R$ ' + (camisa.qt * camisa.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex'
    }

    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    seleciona('.menu-openner span').innerHTML = cart.length
	
    if(cart.length > 0) {
        seleciona('aside').classList.add('show')
        seleciona('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total    = 0

        for(let i in cart) {
            let camisaItem = camisaJson.find( (item) => item.id == cart[i].id )
            console.log(camisaItem)

            subtotal += cart[i].price * cart[i].qt

            let cartItem = seleciona('.models .cart--item').cloneNode(true)
            seleciona('.cart').append(cartItem)

            let camisaSizeName = cart[i].size

            let camisaName = `${camisaItem.name} (${camisaSizeName})`

            cartItem.querySelector('img').src = camisaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = camisaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                console.log('Clicou no botão mais')
                cart[i].qt++
                atualizarCarrinho()
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                console.log('Clicou no botão menos')
                if(cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

                atualizarCarrinho()
            })

            seleciona('.cart').append(cartItem)
        }

        desconto = subtotal * 0
        total = subtotal - desconto

        seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
        seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
        seleciona('.total span:last-child').innerHTML    = formatoReal(total)

    } else {
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
    }
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

camisaJson.map((item, index ) => {
    let camisaItem = document.querySelector('.models .camisa-item').cloneNode(true)
    seleciona('.camisa-area').append(camisaItem)

    preencheDadosDascamisa(camisaItem, item, index)
    
    camisaItem.querySelector('.camisa-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na camisa')

        let chave = pegarKey(e)
        abrirModal()
        preencheDadosModal(item)
        preencherTamanhos(chave)

        seleciona('.camisaInfo--qt').innerHTML = quantcamisa
        escolherTamanhoPreco(chave)
    })

    botoesFechar()

})

mudarQuantidade()
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()

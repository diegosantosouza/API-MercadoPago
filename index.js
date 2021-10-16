const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();

MercadoPago.configure({
    sandbox: true,
    access_token: 'TEST-5061271990683571-100513-42743ebd44c1ac16ba21dd4e70d6bc31-33697405'
});

app.get('/', (req, res) => {
    res.send('ok');
})

var id = ''+Date.now();
var emailDoPagador = 'diego@gmail.com';

app.get('/pagar', async (req, res) => {
    var dados = {
        items: [
            item = {
                id: id,  //UUID & DATA
                title: 'simple item',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer:{
            email: emailDoPagador
        },
        external_reference: id,
    }
    try {
        var pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
        return res.redirect(pagamento.body.init_point);
    }catch (err) {
        return res.send(err.message);
    }
    
})

app.listen(3000, () => console.log('Servidor rodando'));
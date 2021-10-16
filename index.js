const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();

MercadoPago.configure({
    sandbox: true,
    access_token: 'YOUR_ACCESS_TOKEN' //Set your access_token
});

app.get('/', (req, res) => {
    res.send('ok');
})

var id = '' + Date.now();
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
        payer: {
            email: emailDoPagador
        },
        external_reference: id,
    }
    try {
        var pagamento = await MercadoPago.preferences.create(dados);
        return res.redirect(pagamento.body.init_point);
    } catch (err) {
        return res.send(err.message);
    }

})

app.post('/not', (req, res) => {
    var id = req.query.id;
    setTimeout(() => {
        var filter = {
            'order.id': id,
        }
        MercadoPago.payment.search({
            qs: filter,
        }).then(data => {
            var pagamento = data.body.results[0];

            if (pagamento != undefined) {
                console.log(pagamento);
                console.log(pagamento.external_reference);
                console.log(pagamento.status); //approved or reproved
            } else {
                console.log('Pagamento não existe');
            }
        }).catch(err => {
            console.log(err);
        })
    }, 10000);
    res.send('ok');
})

app.listen(3000, () => console.log('Servidor rodando'));
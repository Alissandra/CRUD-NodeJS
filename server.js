const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const uri = //cole aqui a url de conexão da sua conta do MongoDB, adicione o usário e a senha

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('dblist')

    app.listen(3000, () => {
        console.log('server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

// Configurando view engine no Express
app.set('view engine', 'ejs')

app.get('/', (req, res) => {    
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()    
})

//Ler
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })
    })
      
})

//Cria
app.post('/show', (req, res) => {
    db.collection('data').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no banco de dados')
        res.redirect('/show')        
    })
    
})

// Edita
app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id //Armazena o id em params vindo da view

    // .find(Obect(id)) irá percorrer o array no BD e encontrará o id do objeto a ser editado
    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result }) //Vai renderizar a view edit.ejs passando o resultado do objeto para ser usado com os valores dentro do form
    })
})

.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var email = req.body.email

    // updateOne() recebe o objeto que está sendo editado e $set recebe os novos dados 
    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            email: email
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de dados')
    })
})

// Deleta
app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) return resizeBy.send(500, err)
        console.log('Deletado do Banco de dados!')
        res.redirect('/show')
    })
})
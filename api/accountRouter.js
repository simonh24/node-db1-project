const express = require('express');

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
    db('accounts')
        .then(acc => {
            res.status(200).json(acc);
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
        })
});

router.get("/:id", (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .first()
        .then(acc => {
            if (!acc) {
                res.status(404).json({ error: 'account not found' });
            }
            res.status(200).json(acc);
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
        })
});

router.post('/', (req, res) => {
    // db('accounts')
    //     .insert(req.body, 'id')
    //     .then(acc => {
    //         res.status(201).json(acc);
    //     })
    //     .catch(err => {
    //         res.status(500).json({ error: 'something went wrong' });
    //     })
    if (!req.body.name || !req.body.budget) {
        res.status(404).json({ error: 'missing name or budget field' });
    } else {
        db('accounts')
            .insert(req.body, 'id')
            .then(acc => {
                res.status(201).json({ id: acc[0], ...req.body });
            })
            .catch(err => {
                res.status(500).json({ error: 'something went wrong' });
            })
    }
});

router.put('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .update(req.body)
        .then(change => {
            if (change === 0) {
                res.status(404).json({ error: 'account not found' });
            }
            res.status(200).json({ message: 'changes applied' });
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

router.delete('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .del()
        .then(change => {
            if (change === 0) {
                res.status(404).json({ error: 'account not found' });
            }
            res.status(200).json({ message: 'account deleted' });
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
        })
});

module.exports = router;

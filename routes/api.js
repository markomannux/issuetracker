/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.connect(CONNECTION_STRING);

const issueSchema = new Schema({
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: {type: String, default: ''},
  status_text: {type: String, default: ''},
  created_on: {type: Date, default: Date.now},
  updated_on: {type: Date, default: Date.now},
  open: {type: Boolean}
})

const Issue = mongoose.model('Issue', issueSchema);


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let issues = Issue.find(req.query, (err, data) => {
        res.json(data);
      });
    })
    
    .post(function (req, res){
      var project = req.params.project;

      let issue = new Issue(req.body);
      issue.open = true;
      issue.save((err, data) => {
        if (err) {
          res.send('missing input');
          return;
        }
        res.json(data);
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      console.log(req.body);
      if (req.body._id && Object.keys(req.body).length === 1 && req.body.constructor === Object) {
        res.send('No updated fields sent');
        return;
      }

      const issue = Issue.findByIdAndUpdate(
        req.body._id,
        req.body,
        {new: true},
        (err, data) => {
          res.json(data);
        });

    })
    
    .delete(function (req, res){
      var project = req.params.project;
      console.log(req.query)
      if (!req.query._id) {
        res.send("_id error");
        return;
      }

      Issue.deleteOne(req.query._id, (err) => {
        res.send(`deleted ${req.query._id}`)
      })

    });
    
};

module.exports = function (db, done) {
  db.user.bulkCreate([
    {username: "markus", email: "markus@markus.de", password: "markus"},
    {username: "johannes", email: "johannes@johannes.de", password: "johannes"},
    {username: "marius", email: "marius@marius.de", password: "marius"},
    {username: "marcus", email: "marcus@marcus.de", password: "marcus"},
    {username: "hanspeter", email: "hanspeter@hanspeter.de", password: "hanspeter"},
    {username: "claudius", email: "claudius@claudius.de", password: "claudius"},
    {username: "friedrich", email: "friedrich@friedrich.de", password: "friedrich"},
    {username: "gustav", email: "gustav@gustav.de", password: "gustav"},
    {username: "gustavo", email: "gustavo@gustavo.de", password: "gustavo"},
    {username: "gustavio", email: "gustavio@gustavio.de", password: "gustavio"}
  ])
  .then(() => {
    return db.poll.bulkCreate([
      {title: "What is your favorite animal?", userId: 1},
      {title: "What is your favorite star?", userId: 2},
      {title: "What is your favorite drink?", userId: 3},
      {title: "What is your favorite food?", userId: 4},
      {title: "What is your favorite beer?", userId: 5},
      {title: "What is your favorite human?", userId: 6},
      {title: "What is your favorite snake?", userId: 7},
      {title: "What is your favorite spider?", userId: 8},
      {title: "What is your favorite game?", userId: 9},
      {title: "What is your favorite fruit?", userId: 10}
    ]);
  })
  .then(() => {
    return db.option.bulkCreate([
      {title: "dog", pollId: 1},
      {title: "cat", pollId: 1},
      {title: "horse", pollId: 1},

      {title: "andromeda", pollId: 2},
      {title: "sirius", pollId: 2},

      {title: "beer", pollId: 3},
      {title: "liquor", pollId: 3},
      {title: "vodka", pollId: 3},

      {title: "becks", pollId: 5},
      {title: "radeberger", pollId: 5},

      {title: "friedrich", pollId: 6},
      {title: "klaus", pollId: 6},

      {title: "black widow", pollId: 8},
      {title: "Brown Recluse", pollId: 8},

      {title: "chess", pollId: 9},
      {title: "tennis", pollId: 9},

      {title: "apple", pollId: 10},
      {title: "cherry", pollId: 10},
    ]);
  })
  .then(() => {
    return db.vote.bulkCreate([
      {userId: 1, optionId: 1},
      {userId: 2, optionId: 2},
      {userId: 3, optionId: 3},
      {userId: 4, optionId: 4},
      {userId: 5, optionId: 5},
      {userId: 6, optionId: 6},
      {userId: 7, optionId: 7},
      {userId: 8, optionId: 8},
      {userId: 9, optionId: 9},
      {userId: 10, optionId: 10},
      {userId: 1, optionId: 10},
      {userId: 2, optionId: 9},
      {userId: 3, optionId: 8},
      {userId: 4, optionId: 7},
      {userId: 5, optionId: 6},
      {userId: 6, optionId: 5},
      {userId: 7, optionId: 4},
      {userId: 8, optionId: 3},
      {userId: 9, optionId: 2},
      {userId: 10, optionId: 1},
      {userId: 1, optionId: 11},
      {userId: 2, optionId: 12},
      {userId: 3, optionId: 13},
      {userId: 4, optionId: 14},
      {userId: 5, optionId: 15},
      {userId: 6, optionId: 16},
      {userId: 7, optionId: 17},
      {userId: 8, optionId: 18},
      {userId: 9, optionId: 12},
      {userId: 10, optionId: 15},
    ]);
  })
  .then(() => {
    if(process.env.NODE_ENV =! "test") {
      console.log("DB seeded");
    }
    done();
  }, (err) => {
    throw err;
  });
}
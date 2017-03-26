module.exports = function(db, cb) {
  db.user.bulkCreate([
    {username: "markus", email: "markus@markus.de", password: "markus"},
    {username: "johannes", email: "johannes@johannes.de", password: "johannes"},
    {username: "marius", email: "marius@marius.de", password: "marius"},
    {username: "marcus", email: "marcus@marcus.de", password: "marcus"},
    {username: "hanspeter", email: "hanspeter@hanspeter.de", password: "hanspeter"},
    {username: "claudius", email: "claudius@claudius.de", password: "claudius"},
    {username: "friedrich", email: "friedrich@friedrich.de", password: "friedrich"},
    {username: "gustav", email: "gustav@gustav.de", password: "gustav"}
  ]).then(() => {
    return db.poll.bulkCreate([
      {title: "What is your favorite animal?", userId: 1},
      {title: "What is your favorite star?", userId: 2},
      {title: "What is your favorite drink?", userId: 3},
      {title: "What is your favorite food?", userId: 4},
      {title: "What is your favorite beer?", userId: 5},
      {title: "What is your favorite human?", userId: 6},
      {title: "What is your favorite snake?", userId: 7},
      {title: "What is your favorite spider?", userId: 8},
      {title: "What is your favorite game?", userId: 4},
      {title: "What is your favorite fruit?", userId: 2}
    ]).then(() => {
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

        {title: "donald trump", pollId: 6},

        {title: "black widow", pollId: 7},
        {title: "Brown Recluse", pollId: 7},
      ]).then(() => {
        return db.vote.bulkCreate([
          {userId: 1, optionId: 1},
          {userId: 2, optionId: 1},
          {userId: 3, optionId: 5},
          {userId: 4, optionId: 8},
          {userId: 5, optionId: 9},
          {userId: 5, optionId: 1},
          {userId: 2, optionId: 10},
          {userId: 3, optionId: 1},
          {userId: 4, optionId: 3},
          {userId: 2, optionId: 5},
        ]);
      }).then(() => {
        cb();
      });
    });
  });
}
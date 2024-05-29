const unknownEndPoint = (request, response) => {
  response.send('<h1>Page not found</h1>');
};

module.exports = unknownEndPoint;

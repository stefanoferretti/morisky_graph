$(document).ready(function () {
  var data = [
    {
      date: "2010/02/01",
      questions: [{ number: 1, answer: 1}, { number: 2, answer: 1}, { number: 3, answer: 1}, { number: 4, answer: 1}]
    },
    {
      date: "2011/03/16",
      questions: [{ number: 1, answer: 1}, { number: 2, answer: 1}, { number: 3, answer: 0}, { number: 4, answer: 1}]
    },
    {
      date: "2013/04/28",
      questions: [{ number: 1, answer: 0}, { number: 2, answer: 1}, { number: 3, answer: 0}, { number: 4, answer: 1}]
    },
    {
      date: "2012/05/31",
      questions: [{ number: 1, answer: 0}, { number: 2, answer: 0}, { number: 3, answer: 0}, { number: 4, answer: 1}]
    },
    {
      date: "2012/07/08",
      questions: [{ number: 1, answer: 0}, { number: 2, answer: 0}, { number: 3, answer: 0}, { number: 4, answer: 0}]
    }
  ];

  // constructor: new MoriskyGraph(id_dom_el, width, height, data)
  // moriskyGraph = new MoriskyGraph('moriskygraph', 700, 750, data);

  // se width e height sono 0 prende usa la dimensione dell'elemento a cui viene attaccato
  moriskyGraph = new MoriskyGraph('moriskygraph', 0, 0, data);
  moriskyGraph.draw();
});

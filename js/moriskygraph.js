function TotalView (total, xOffset, yOffset, side, cornerRadius) {
  if(!(this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function () {
    self.textLabel = total;
    self.xOffset = xOffset;
    self.yOffset = yOffset;
    self.side = side;
    self.cornerRadius = cornerRadius;
  };

  self.color = function () {
    if (total > 2) {
      return '#cc0000';
    } else {
      return '#00cc00';
    }
  };

  self.draw = function (paper) {
    var dot, label;

    dot = paper.rect(self.xOffset, self.yOffset, self.side, self.side, self.cornerRadius    );
    dot.attr({
      'stroke-width': 0,
      'fill':         self.color(),
      'fill-opacity': 1
    });

    label = paper.text(xOffset + self.side / 2, yOffset + self.side / 2, self.textLabel);
    label.attr({
      'fill':         '#ffffff',
      'font-size':    32,
      'font-family':  "'League Gothic', 'Futura-CondensedMedium', 'Gill SansMT Condensed', 'Arial Narrow', 'sans-serif'"
    });
  };

  self.init();
}

function Question (description, questionNumber, answer) {
  if (!(this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function () {
    self.description = description;
    self.questionNumber = questionNumber;
    self.answer = answer;
  };


  self.init();
}

function QuestionView (question, xOffset, yOffset, radius) {
  if(!(this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function () {
    self.question = question;
    self.xOffset = xOffset + radius;
    self.yOffset = yOffset + radius;
    self.radius = radius;
  };

  self.textLabel = function () {
    if (self.question.answer === 1) {
      return "Si";
    } else {
      return "No";
    }
  };

  self.color = function () {
    if (self.question.answer === 1) {
      return '#cc0000';
    } else {
      return '#00cc00';
    }
  };

  self.opacity = function () {
    if (self.question.answer === 1) {
      return 1;
    } else {
      return 0.3;
    }
  };

  self.draw = function (paper) {
    var dot, label;

    dot = paper.circle(self.xOffset, self.yOffset, self.radius);
    dot.attr({
      'stroke-width': 0,
      'fill':         self.color(),
      'fill-opacity': self.opacity()
    });

    label = paper.text(self.xOffset, self.yOffset, self.textLabel());
    label.attr({
      'fill':         '#ffffff',
      'font-size':    32,
      'font-family':  "'League Gothic', 'Futura-CondensedMedium', 'Gill SansMT Condensed', 'Arial Narrow', 'sans-serif'"
    });
  };

  self.init();
}

function Quiz (date, questions) {
  if(!(this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function () {
    self.date = date;
    self.questions = questions;
  };

  self.total = function () {

    var total = 0;
    $(self.questions).each(function (i, question) {
      total = total + question.answer;
    });

    return total;
  };

  self.init();
}

function QuizView (quiz, xOffset, yOffset, width, height) {
  if(!(this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function () {
    self.xOffset = xOffset;
    self.yOffset = yOffset;
    self.width = width;
    self.height = height;
    self.quiz = quiz;
    self.questionViews = [];
    self.labelAxeDistance = 20;

    self.questions = self.quiz.questions.sort(function (questionA, questionB) {
      if (questionA.questionNumber > questionB.questionNumber) {
        return 1;
      } else if (questionA.questionNumber < questionB.questionNumber) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  self.dotRadius = function() {
    var minSide = Math.min(self.width, self.height / 5);
    return (minSide / 2 * 0.8);
  };

  self.dateLabel = function() {
    var date = self.quiz.date,
        d    = date.getDate(),
        m    = date.getMonth() + 1,
        y    = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + "/" + (m <= 9 ? '0' + m : m) + "/" + date.getFullYear();
  };

  self.drawQuestions = function(paper) {
    var questionXoffset = self.xOffset + (self.width - self.dotRadius() * 2) / 2;
    var questionYoffset;
    var questionView;
    $(self.questions).each(function (i, question) {
      questionYoffset = self.yOffset + ((self.height / 5) - self.dotRadius() * 2) / 2 + (self.height / 5) * (i + 1);

      questionView = new QuestionView(question, questionXoffset, questionYoffset, self.dotRadius());
      questionView.draw(paper);
      self.questionViews.push(questionView);
    });
  };

  self.drawDateLabel = function(paper) {
    var labelXoffset = self.xOffset + self.width / 2;
    var labelYoffset = self.yOffset + self.height + self.labelAxeDistance;
    var label = paper.text(labelXoffset, labelYoffset, self.dateLabel());
    label.attr({
      'fill':         '#333333',
      'font-size':    16,
      'font-family':  "'League Gothic', 'Futura-CondensedMedium', 'Gill SansMT Condensed', 'Arial Narrow', 'sans-serif'"
    });
  };

  self.draw = function (paper) {
    var totalView, yTotalOffset;
    yTotalOffset = self.yOffset + ((self.height / 5) - self.dotRadius() * 2) / 2;
    totalView = new TotalView(self.quiz.total(), self.xOffset + (self.width - self.dotRadius() * 2) / 2, yTotalOffset, self.dotRadius() * 2, 5);

    self.drawQuestions(paper);
    self.drawDateLabel(paper);
    totalView.draw(paper);
  };

  self.init();
}

function MoriskyGraph (domID, width, height, chartData) {
  if (!(this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function() {
    self.quizCollection = [];
    self.xLabelHeight = 50;
    self.yLabelWidth = 200;
    self.yLabelsNumber = 5;

    if (width === 0 || height === 0) {
      self.domElement = $('#' + domID);
      $(window).on('resize', function () {
        self.width = self.domElement.width();
        self.height = self.domElement.height();

        self.paper.clear();
        self.paper.remove();
        self.paper = Raphael(domID, self.width, self.height);
        self.draw();
      });
      self.width = self.domElement.width();
      self.height = self.domElement.height();
    } else {
      self.width = width;
      self.height = height;
    }

    self.populateQuizCollection();
    self.paper = Raphael(domID, self.width, self.height);
  };

  self.labels = function () {
    return [
      "Quando si sente peggio,\na volte, interrompe la terapia?",
      "Quando si sente meglio,\na volte, interrompe la terapia?",
      "E' occasionalmente poco\nattento nell'assunzione dei farmaci?",
      "Si è mai dimenticato di\nassumere farmaci?"
    ];
  };

  self.quizViewHeight = function() {
    return self.height - self.xLabelHeight;
  };

  self.quizViewWidth = function() {
    return self.width - self.yLabelWidth;
  };

  self.populateQuizCollection = function () {
    $(chartData).each(function (i, quiz) {
      var date = new Date(quiz.date);
      var questions = [];

      $(quiz.questions).each(function (ii, question) {
        var new_question = new Question(question.description, question.number, question.answer);
        questions.push(question);
      });

      var new_quiz = new Quiz(date, questions);
      self.quizCollection.push(new_quiz);
    });

    self.quizCollection.sort(function(quizA, quizB) {
      if (quizA.date > quizB.date) {
        return 1;
      } else if (quizA.date < quizB.date) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  self.drawAxes = function() {
    var xPath = "M" + self.yLabelWidth + " " + self.quizViewHeight() + "L" + self.width + " " + self.quizViewHeight(),
        yPath = "M" + self.yLabelWidth + " 0L" + self.yLabelWidth + " " + self.quizViewHeight(),
        xAx   = self.paper.path(xPath),
        yAx   = self.paper.path(yPath);
    xAx.attr({
      'stroke': '#bbbbbb'
    });
    yAx.attr({
      'stroke': '#bbbbbb'
    });

    for (var i = 1; i <= 4; i++) {
      var xAxOffset = (self.quizViewHeight() / 5) * i;
      xPath = "M" + (self.yLabelWidth * 0.2) + " " + xAxOffset + "L" + self.width + " " + xAxOffset;
      xAx   = self.paper.path(xPath);
      xAx.attr({
        'stroke': '#eeeeee'
      });
      xAx.toBack();
    }

  };

  self.drawQuizViews = function () {
    self.quizViews = [];
    var spaceBetweenQuiz = (self.quizViewWidth()) / self.quizCollection.length;
    $(self.quizCollection).each(function (i, quiz) {
      var quizView = new QuizView(quiz, self.yLabelWidth + spaceBetweenQuiz * i, 0, spaceBetweenQuiz, self.quizViewHeight());
      quizView.draw(self.paper);
      self.quizViews.push(quizView);
    });
  };

  self.drawYlabels = function () {
    var label, xLabelOffset, yLabelOffset;
    xLabelOffset = self.yLabelWidth - 10;

    $(self.labels()).each(function (i, label) {
      yLabelOffset = (self.quizViewHeight() / self.yLabelsNumber) / 2 + (self.quizViewHeight() / self.yLabelsNumber) * (i + 1);
      label = self.paper.text(xLabelOffset, yLabelOffset, label);
      label.attr({
        'fill':         '#333333',
        'font-size':    16,
        'font-family':  "'League Gothic', 'Futura-CondensedMedium', 'Gill SansMT Condensed', 'Arial Narrow', 'sans-serif'",
        'text-anchor': "end"
      });
    });

    yLabelOffset = (self.quizViewHeight() / self.yLabelsNumber) / 2;
    label = self.paper.text(xLabelOffset, yLabelOffset, "Totale");
    label.attr({
      'fill':         '#333333',
      'font-size':    32,
      'font-family':  "'League Gothic', 'Futura-CondensedMedium', 'Gill SansMT Condensed', 'Arial Narrow', 'sans-serif'",
      'text-anchor': "end"
    });
  };

  self.draw = function () {
    self.drawAxes();
    self.drawYlabels();
    self.drawQuizViews();
  };

  self.init();
}
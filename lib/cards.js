module.exports.searchCardList = (cards, search) => {
  return cards.filter((card) => card.name.includes(search));
};

module.exports.sortCardList = (cards, sort, presorted) => {
  if (sort === "Review") {
    return cards.sort((firstCard, secondCard) => {
      var diff = firstCard.progress - secondCard.progress;
      return diff || firstCard.nextDate - secondCard.nextDate;
    });
  } else if (!presorted) {
    return cards.sort(
      (firstCard, secondCard) => firstCard.date - secondCard.date
    );
  } else {
    return cards;
  }
};

const getCardReviewDate = (card, progress) => {
  if (progress) {
    var nextDate = new Date(progress.lastDate);
    const nowDate = new Date();
    nextDate.setDate(nextDate.getDate() + Math.pow(progress.level, 2));

    if (progress.level) {
      nextDate.setHours(nextDate.getHours() - 6);
    }

    const interval = Math.ceil((nextDate - nowDate) / (1000 * 60 * 60 * 24));
    if (interval > 0) {
      card.progress = interval;
    } else {
      card.progress = -1;
    }
    card.level = progress.level;
    card.nextDate = nextDate;
  } else {
    card.progress = 0;
    card.nextDate = card.date;
  }

  return card;
};

module.exports.getCardListWithReviewDate = (cards, userProgress) => {
  return cards.map((card) =>
    getCardReviewDate(
      card,
      userProgress.find((progress) => card._id.equals(progress.cardId))
    )
  );
};

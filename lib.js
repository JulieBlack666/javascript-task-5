'use strict';

function getChosenFriendsList(friends, circlesCount = Infinity) {
    const friendsOrdered = friends.sort((x, y) => x.name.localeCompare(y.name));
    let currentCircle = friendsOrdered.filter(f => f.best);
    let result = [];

    while (currentCircle.length && circlesCount-- > 0) {
        result = result.concat(currentCircle);
        const usedNames = result.map(e => e.name);
        const nextCircleNames = currentCircle
            .reduce((acc, next) => acc.concat(next.friends), [])
            .filter(n => !usedNames.includes(n));

        currentCircle = friends.filter(e => nextCircleNames.includes(e.name));
    }

    return result;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter should be an instanse of Filter');
    }

    this.orderedFriends = getChosenFriendsList(friends, this.maxLevel).filter(filter.isSutable);
    this.next = () => (this.done() ? null : this.orderedFriends.shift());
    this.done = () => !this.orderedFriends.length;
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isSutable = Boolean;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    const maleFilter = Object.create(Filter.prototype);
    maleFilter.isSutable = friend => friend.gender === 'male';

    return maleFilter;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    const femaleFilter = Object.create(Filter.prototype);
    femaleFilter.isSutable = friend => friend.gender === 'female';

    return femaleFilter;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;

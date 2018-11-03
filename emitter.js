'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        listeners: new Proxy(
            {},
            {
                get: (target, name) =>
                    target.hasOwnProperty(name) ? target[name] : (target[name] = [])
            }
        ),

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            this.listeners[event].push({ handler: handler.bind(context), context });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @param {bool} isRecursion
         * @returns {Object} this
         */
        off: function (event, context, isRecursion = false) {
            for (const [index, callback] of this.listeners[event].entries()) {
                if (callback.context === context) {
                    this.listeners[event].splice(index, 1);

                    break;
                }
            }
            if (!isRecursion) {
                Object.keys(this.listeners).forEach(
                    key => key.startsWith(event + '.') && this.off(key, context, true)
                );
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            for (const callback of this.listeners[event]) {
                callback.handler();
            }
            const removedAfterDot = event.replace(/\.[^.]+$/, '');
            if (removedAfterDot !== event) {
                this.emit(removedAfterDot);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};

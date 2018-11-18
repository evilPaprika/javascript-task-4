'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const listeners = new Proxy(
        {},
        {
            get: (target, name) =>
                target.hasOwnProperty(name) ? target[name] : (target[name] = [])
        }
    );

    /**
     * Отписаться от события но не от детей события
     * @param {String} event
     * @param {Object} context
     */
    function unsubscribe(event, context) {
        for (const [index, callback] of listeners[event].entries()) {
            if (callback.context === context) {
                listeners[event].splice(index, 1);
            }
        }
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            listeners[event].push({ handler: handler.bind(context), context });

            return this;
        },

        /**
         * Отписаться от события и от детей события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            unsubscribe(event, context);
            const childStartsWith = event + '.';
            Object.keys(listeners).forEach(
                listener => listener.startsWith(childStartsWith) && unsubscribe(listener, context)
            );

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            for (const callback of listeners[event]) {
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
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            let counter = times;
            this.on(event, context, () => {
                if (counter) {
                    handler.call(context);
                    counter--;
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            let counter = 0;
            this.on(event, context, () => {
                if (!(counter++ % frequency)) {
                    handler.call(context);
                }
            });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};

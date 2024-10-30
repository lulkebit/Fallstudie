const mongoose = require('mongoose');
const { Schema } = mongoose;

const pageViewSchema = new Schema({
    date: {
        type: Date,
        required: true,
        index: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

pageViewSchema.statics.getLast7Days = async function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const views = await this.find({
        date: {
            $gte: sevenDaysAgo,
            $lte: today,
        },
    }).sort({ date: 1 }); // Aufsteigend sortiert nach Datum

    const result = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(sevenDaysAgo);
        currentDate.setDate(currentDate.getDate() + i);

        const existingView = views.find(
            (v) => v.date.toDateString() === currentDate.toDateString()
        );

        result.push({
            date: currentDate.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
            }),
            views: existingView ? existingView.views : 0,
        });
    }

    // Berechne die prozentuale Veränderung
    if (result.length >= 2) {
        const firstDayViews = result[0].views;
        const lastDayViews = result[result.length - 1].views;
        const percentageChange =
            firstDayViews === 0
                ? lastDayViews === 0
                    ? 0
                    : 100
                : (
                      ((lastDayViews - firstDayViews) / firstDayViews) *
                      100
                  ).toFixed(1);

        // Füge die prozentuale Veränderung zu den Metadaten hinzu
        result.percentageChange = percentageChange;
    } else {
        result.percentageChange = 0;
    }

    return result;
};

pageViewSchema.statics.getTotalViewsCount = async function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const views = await this.find({
        date: {
            $gte: sevenDaysAgo,
            $lte: today,
        },
    });

    return views.reduce((total, day) => total + day.views, 0);
};

const PageViewModel = mongoose.model('PageView', pageViewSchema);

module.exports = PageViewModel;

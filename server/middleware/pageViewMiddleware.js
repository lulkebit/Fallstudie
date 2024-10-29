const PageView = require('../models/pageView');

const getPageViewStats = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        // Hole alle Einträge der letzten 7 Tage
        const views = await PageView.find({
            date: {
                $gte: sevenDaysAgo,
                $lte: today,
            },
        }).sort({ date: 1 });

        // Erstelle ein Array mit allen 7 Tagen
        const viewData = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(sevenDaysAgo);
            currentDate.setDate(currentDate.getDate() + i);

            const existingView = views.find(
                (v) => v.date.toDateString() === currentDate.toDateString()
            );

            viewData.push({
                date: currentDate.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                }),
                views: existingView ? existingView.views : 0,
            });
        }

        // Berechne Gesamtaufrufe
        const totalViews = viewData.reduce((sum, day) => sum + day.views, 0);

        return {
            pageViewCount: totalViews,
            pageViewsData: viewData,
        };
    } catch (error) {
        console.error('Error in getPageViewStats:', error);
        return {
            pageViewCount: 0,
            pageViewsData: [],
        };
    }
};

const trackPageView = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let pageView = await PageView.findOne({ date: today });
        if (!pageView) {
            pageView = new PageView({ date: today });
        }

        pageView.views += 1;
        pageView.lastUpdated = new Date();
        await pageView.save();

        next();
    } catch (error) {
        console.error('Error tracking page view:', error);
        next(error);
    }
};

module.exports = { trackPageView, getPageViewStats };

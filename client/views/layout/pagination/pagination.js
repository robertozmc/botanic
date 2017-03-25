import {gardensCurrentPage, gardensNumberOfPages} from '../../gardens_routes/gardens/gardens.js';
import {ordersCurrentPage, ordersNumberOfPages} from '../../orders_routes/orders/orders.js';
import {plantsCurrentPage, plantsNumberOfPages} from '../../plants_routes/plants/plants.js';
import {newsCurrentPage, newsNumberOfPages} from '../../news_routes/news/news.js';
import {seedsCurrentPage, seedsNumberOfPages} from '../../seeds_routes/seeds/seeds.js';
import {usersCurrentPage, usersNumberOfPages} from '../../admin_routes/users/users.js';

import {arboretumCurrentPage, arboretumNumberOfPages} from '../../public_routes/index_plantarum/index_plantarum.js';
import {medicinalPlantsSectorCurrentPage, medicinalPlantsSectorNumberOfPages} from '../../public_routes/index_plantarum/index_plantarum.js';
import {decorativeDepartmentCurrentPage, decorativeDepartmentNumberOfPages} from '../../public_routes/index_plantarum/index_plantarum.js';
import {systematicsCurrentPage, systematicsNumberOfPages} from '../../public_routes/index_plantarum/index_plantarum.js';
import {pharmacognosyCurrentPage, pharmacognosyNumberOfPages} from '../../public_routes/index_plantarum/index_plantarum.js';
import {greenhouseCurrentPage, greenhouseNumberOfPages} from '../../public_routes/index_plantarum/index_plantarum.js';
import {moorCurrentPage, moorNumberOfPages} from '../../public_routes/index_plantarum/index_plantarum.js';
import {duneCurrentPage, duneNumberOfPages} from '../../public_routes/index_plantarum/index_plantarum.js';

Template.pagination.onCreated(function() {
    const instance = this;

    instance.pageType = instance.data.page;
});

Template.pagination.helpers({
    previousButtonState: () => {
        const currentPage = getCurrentPage(Template.instance().pageType);

        return parseInt(currentPage) === 1 ? 'disabled' : '';
    },
    nextButtonState: () => {
        const currentPage = getCurrentPage(Template.instance().pageType);
        const numberOfPages = getNumberOfPages(Template.instance().pageType);

        return parseInt(currentPage) === parseInt(numberOfPages) ? 'disabled' : '';
    },
    moreThanOnePage: () => {
        const numberOfPages = getNumberOfPages(Template.instance().pageType);

        return numberOfPages !== 1 && numberOfPages !== 0;
    },
    activePage: page => {
        const currentPage = getCurrentPage(Template.instance().pageType);

        return currentPage === page ? 'active' : '';
    },
    lastPage: () => {
        const numberOfPages = getNumberOfPages(Template.instance().pageType);

        return numberOfPages;
    },
    paginationState: () => {
        const currentPage = getCurrentPage(Template.instance().pageType);
        const numberOfPages = getNumberOfPages(Template.instance().pageType);

        if (numberOfPages <= 10) {
            return 'all';
        } else {
            if (currentPage <= 4) {
                return 'front';
            } else if (currentPage > 4 && currentPage < numberOfPages - 3) {
                return 'middle';
            } else if (currentPage > numberOfPages - 4) {
                return 'back';
            }
        }
    },
    isAll: type => {
        return type === 'all';
    },
    isFront: type => {
        return type === 'front';
    },
    isMiddle: type => {
        return type === 'middle';
    },
    isBack: type => {
        return type === 'back';
    },
    pages: () => {
        const currentPage = getCurrentPage(Template.instance().pageType);
        const numberOfPages = getNumberOfPages(Template.instance().pageType);

        if (numberOfPages <= 10) {
            // all pages
            let pages = [];

            for (let i = 2; i < numberOfPages; i++) {
                pages.push(i);
            }

            return pages;
        } else {
            // with threedot
            let pages = [];

            if (currentPage <= 4) {
                switch (currentPage) {
                    case 1:
                        return [2, 3];
                    case 2:
                        return [2, 3, 4];
                    case 3:
                        return [2, 3, 4, 5];
                    case 4:
                        return [2, 3, 4, 5, 6];
                    default:
                        return [];
                }
            } else if (currentPage > 4 && currentPage < numberOfPages - 3) {
                return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
            } else if (currentPage > numberOfPages - 4) {
                switch (currentPage) {
                    case numberOfPages:
                        return [numberOfPages - 2, numberOfPages - 1];
                    case numberOfPages - 1:
                        return [numberOfPages - 3, numberOfPages - 2, numberOfPages - 1];
                    case numberOfPages - 2:
                        return [numberOfPages - 4, numberOfPages - 3, numberOfPages - 2, numberOfPages - 1];
                    case numberOfPages - 3:
                        return [numberOfPages - 5, numberOfPages - 4, numberOfPages - 3, numberOfPages - 2, numberOfPages - 1];
                    default:
                        return [];
                }
            }
        }

    }
});

Template.pagination.events({
    "click #previousPage": (e, t) => {
        e.preventDefault();

        let currentPage = getCurrentPage(t.pageType);

        if (currentPage !== 1) {
            if (currentPage > 1) {
                currentPage = currentPage - 1;
            } else {
                currentPage = 1;
            }

            setCurrentPage(t.pageType, currentPage);
        }
    },
    "click #nextPage": (e, t) => {
        e.preventDefault();

        let currentPage = getCurrentPage(t.pageType);
        const numberOfPages = getNumberOfPages(t.pageType);

        if (currentPage !== numberOfPages) {
            if (currentPage < numberOfPages) {
                currentPage = currentPage + 1;
            } else {
                currentPage = 2;
            }

            setCurrentPage(t.pageType, currentPage);
        }
    },
    "click .page": (e, t) => {
        e.preventDefault();

        const currentPage = getCurrentPage(t.pageType);
        const id = e.currentTarget.id;
        const page = parseInt(id.replace('page_', ''));

        if (currentPage !== page) {
            setCurrentPage(t.pageType, page);
        }
    }
});

const getCurrentPage = pageType => {
    let currentPage;

    switch (pageType) {
        case 'gardens':
            currentPage = gardensCurrentPage.get();
            break;
        case 'orders':
            currentPage = ordersCurrentPage.get();
            break;
        case 'plants':
            currentPage = plantsCurrentPage.get();
            break;
        case 'news':
            currentPage = newsCurrentPage.get();
            break;
        case 'seeds':
            currentPage = seedsCurrentPage.get();
            break;
        case 'users':
            currentPage = usersCurrentPage.get();
            break;
        case 'arboretum':
            currentPage = arboretumCurrentPage.get();
            break;
        case 'medicinalPlantsSector':
            currentPage = medicinalPlantsSectorCurrentPage.get();
            break;
        case 'decorativeDepartment':
            currentPage = decorativeDepartmentCurrentPage.get();
            break;
        case 'systematics':
            currentPage = systematicsCurrentPage.get();
            break;
        case 'pharmacognosy':
            currentPage = pharmacognosyCurrentPage.get();
            break;
        case 'greenhouse':
            currentPage = greenhouseCurrentPage.get();
            break;
        case 'moor':
            currentPage = moorCurrentPage.get();
            break;
        case 'dune':
            currentPage = duneCurrentPage.get();
            break;
        default:
            break;
    }

    return currentPage;
};

const getNumberOfPages = pageType => {
    let numberOfPages;

    switch (pageType) {
        case 'gardens':
            numberOfPages = gardensNumberOfPages.get();
            break;
        case 'orders':
            numberOfPages = ordersNumberOfPages.get();
            break;
        case 'plants':
            numberOfPages = plantsNumberOfPages.get();
            break;
        case 'news':
            numberOfPages = newsNumberOfPages.get();
            break;
        case 'seeds':
            numberOfPages = seedsNumberOfPages.get();
            break;
        case 'users':
            numberOfPages = usersNumberOfPages.get();
            break;
        case 'arboretum':
            numberOfPages = arboretumNumberOfPages.get();
            break;
        case 'medicinalPlantsSector':
            numberOfPages = medicinalPlantsSectorNumberOfPages.get();
            break;
        case 'decorativeDepartment':
            numberOfPages = decorativeDepartmentNumberOfPages.get();
            break;
        case 'systematics':
            numberOfPages = systematicsNumberOfPages.get();
            break;
        case 'pharmacognosy':
            numberOfPages = pharmacognosyNumberOfPages.get();
            break;
        case 'greenhouse':
            numberOfPages = greenhouseNumberOfPages.get();
            break;
        case 'moor':
            numberOfPages = moorNumberOfPages.get();
            break;
        case 'dune':
            numberOfPages = duneNumberOfPages.get();
            break;
        default:
            break;
    }

    return numberOfPages;
};

const setCurrentPage = (pageType, value) => {
    switch (pageType) {
        case 'gardens':
            gardensCurrentPage.set(value);
            break;
        case 'orders':
            ordersCurrentPage.set(value);
            break;
        case 'plants':
            plantsCurrentPage.set(value);
            break;
        case 'news':
            newsCurrentPage.set(value);
            break;
        case 'seeds':
            seedsCurrentPage.set(value);
            break;
        case 'users':
            usersCurrentPage.set(value);
            break;
        case 'arboretum':
            arboretumCurrentPage.set(value);
            break;
        case 'medicinalPlantsSector':
            medicinalPlantsSectorCurrentPage.set(value);
            break;
        case 'decorativeDepartment':
            currentPage = decorativeDepartmentCurrentPage.set(value);
            break;
        case 'systematics':
            currentPage = systematicsCurrentPage.set(value);
            break;
        case 'pharmacognosy':
            currentPage = pharmacognosyCurrentPage.set(value);
            break;
        case 'greenhouse':
            currentPage = greenhouseCurrentPage.set(value);
            break;
        case 'moor':
            currentPage = moorCurrentPage.set(value);
            break;
        case 'dune':
            currentPage = duneCurrentPage.set(value);
            break;
        default:
            break;
    }
};
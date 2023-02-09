export enum Category {
    Athletics,
    Swimming,
    Football,
    Gymnastics,
    GeneralDevelopment,
}

export const ACTIVITY_CATEGORIES: { value: Category, label: string }[] = [
    {
        value: Category.Athletics, label: 'Lekkoateltyka',
    },
    {
        value: Category.Swimming, label: 'Pływanie',
    },
    {
        value: Category.Football, label: 'Piłka nożna',
    },
    {
        value: Category.Gymnastics, label: 'Gimnastyka',
    },
    {
        value: Category.GeneralDevelopment, label: 'Zajęcia ogólnorozwojowe',
    },

]
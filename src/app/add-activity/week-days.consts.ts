export enum WeekDay {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
};

export const WEEK_DAYS: { value: WeekDay, label: string }[] = [
    {
        value: WeekDay.Monday, label: 'Poniedziałek',
    },
    {
        value: WeekDay.Tuesday, label: 'Wtorek',
    },
    {
        value: WeekDay.Wednesday, label: 'Środa',
    },
    {
        value: WeekDay.Thursday, label: 'Czwartek',
    },
    {
        value: WeekDay.Friday, label: 'Piątek',
    },
    {
        value: WeekDay.Saturday, label: 'Sobota',
    },
    {
        value: WeekDay.Sunday, label: 'Niedziela',
    },
];
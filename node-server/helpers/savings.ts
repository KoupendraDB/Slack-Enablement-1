function savings(income: number, expense: number): number {
    if (income && typeof income === 'number' && expense && typeof expense === 'number') {
        let saving = income - expense
        return saving > 0 ? saving : 0;
    }
    return 0;
};

module.exports = {
    savings: savings
};

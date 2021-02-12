export const generateMapStateToProps = (field: string) => {
    return (state: any, ownProps: any) => {
        return {...ownProps, [field]: state[field]};
    };
}
const getPagination = (req) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page-1)*limit
    return {page, limit, skip}
}

const paginationReturn = (data, page, limit, total ) => (
    {
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total/limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page>1
    }
)

export {getPagination, paginationReturn}
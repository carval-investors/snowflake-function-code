var averageDaysPerYear = 365.25   // (365 * 4) + 1 
var averageDaysPerMonth = 30.4375  // averageDaysPerYear / 12 

function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

function dateDiff(d1, d2, type) {
    switch (type) {
        case "years":
            timePeriod = 31557600000  // 1000 * 60 * 60 * 24 * averageDaysPerYear
            break
        case "months":
            timePeriod = 2629800000   // 1000 * 60 * 60 * 24 * averageDaysPerMonth
            break
        case "weeks":
            timePeriod = 604800000    // 1000 * 60 * 60 * 24 * 7
            break
        case "days":
            timePeriod = 86400000     // 1000 * 60 * 60 * 24
            break
        case "hours":
            timePeriod = 3600000      // 1000 * 1
            break
        case "minutes":
            timePeriod = 60000        // 1000 * 1
            break
        case "seconds":
            timePeriod = 1000         // 1000 * 1
            break
        default: // milliseconds
            timePeriod = 1
    }

    return Math.round((d1 - d2) / timePeriod)
}

// Credits: algorithm inspired by Apache OpenOffice
// Calculates the resulting amount
function irrResult(v, d, r) {
    var result = 0.0

    var r = r + 1
    var result = v[0]
    for (var i = 1; i < v.length; i++) {
        result += v[i] / Math.pow(r, dateDiff(d[i], d[0], "days") / averageDaysPerYear)
    }
    return result
}

// Calculates the first derivation
function irrResultDeriv(v, d, r) {
    var result = 0.0
    //if (typeof r == "number" && Array.isArray(v) && Array.isArray(d) && v.length == d.length) {
        var r = r + 1
        for (var i = 1; i < v.length; i++) {
            var frac = dateDiff(d[i], d[0], "days") / averageDaysPerYear
            result -= frac * v[i] / Math.pow(r, frac + 1)
        }
    //}
    return result
}

function get_xirr(values = [], dates = [], guess = 0.1) {
// Check that values contains at least one positive value and one negative value
    var positive = false
    var negative = false
    for (var i = 0; i < values.length; i++) {
        if (values[i] > 0) positive = true
        if (values[i] < 0) negative = true
        //  return values[i];
    }

    // Return error if values does not contain at least one positive value and one negative value
    // if (!positive || !negative) return '1111';

    var resultRate = guess

    // Set maximum epsilon for end of iteration
    var epsMax = 1e-10

    // Set maximum number of iterations
    var iterMax = 50

    // Implement Newton's method
    var newRate, epsRate, resultValue
    var iteration = 0
    var countLoop = true
    do {
        resultValue = irrResult(values, dates, resultRate)
        newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate)
        epsRate = Math.abs(newRate - resultRate)
        resultRate = newRate
        countLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax)
    } while (countLoop && (++iteration < iterMax))

    if (countLoop) return 'NA'

    // Return internal rate of return
    return resultRate
}


rate = 0.1
inarray = [-1000, 250, 250, 250, 250, 250]
dates = [new Date('1/1/2018'), new Date('6/1/2018'), new Date('12/1/2018'), new Date('3/1/2018'), new Date('9/1/2018'), new Date('12/30/2018')]
console.log("input rate: " + rate)
console.log("input array: " + inarray)
console.log("input dates: " + dates)
console.log("days: " + Math.round((dates[0] - dates[1]) / 86400000))
// with no input
console.log(get_xirr())
console.log(get_xirr(0.1, [1, 2]))
console.log(get_xirr(inarray, dates, rate))
console.log(get_xirr(0.1, [1, 2], "ad"))
console.log(get_xirr(0.1, 0.1, 0.1))
console.log(get_xirr(0.1, [1, 2], "ad"))
console.log(get_xirr(0.1, inarray, [dates[1], dates[2]]))

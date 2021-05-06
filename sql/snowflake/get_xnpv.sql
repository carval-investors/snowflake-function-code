CREATE OR REPLACE FUNCTION get_xnpv (r double, v array, d array)
    RETURNS double
    LANGUAGE JAVASCRIPT
    AS $$
    var averageDaysPerYear  = 365.25   // (365 * 4) + 1 
    var averageDaysPerMonth = 30.4375  // averageDaysPerYear / 12 

    function isValidDate(date) {
        return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
    }

    function dateDiff(d1, d2, type) {
        switch(type) {
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

    function get_xnpv(r = 0.0, v = [], d = []) {
        var result = 0.0;
        
        if (typeof r == "number" && Array.isArray(v) && Array.isArray(d) && v.length == d.length) {
            for (var i = 0; i < v.length; i++) {
                if (typeof v[i] == "number" && isValidDate(d[i])) {
                    result += v[i] / Math.pow(1 + r, dateDiff(d[i], d[0], "days") / averageDaysPerYear);
                } else {
                    result = 0.0
                    break
                }
            }
        }
        return result
    }

    return get_xpnv(r, v, d)
    $$;

const testObject = {
	COMPANY_ENC: {
        IV: '10',
        SECRET: 20
    },
    ARRAY: [
        1,
        2,
        3,
        {
            name: 4,
            sub_array: [
                {
                    id: 1
                },
                {
                    id: 2
                }
            ]
        }
    ],
    CONTAIN: {
        ARRAY: [
            1,
            2,
            3,
            {
                name: 4,
                sub_array: [
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ]
            }
        ]
    }
}

function getObjectPaths(object) {
    let paths = []

    function recurse(obj, keyParent='') {
        if(typeof obj === 'number' || typeof obj === 'string') {
            return
        }
        const isArray = Array.isArray(obj)
        Object.keys(obj).forEach(key => {
            let newKeyParent = keyParent
            if(newKeyParent) {
                if(isArray) {
                    newKeyParent = `${newKeyParent}[${key}]`
                } else {
                    newKeyParent = `${newKeyParent}.${key}`
                }
            } else {
                newKeyParent = key
            }
            paths.push(newKeyParent)
            recurse(obj[key], newKeyParent)
        })
    }

    recurse(object)

    return paths
}

console.log(getObjectPaths(testObject))

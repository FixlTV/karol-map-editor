import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'

export default function Home() {
    const [xLength, setX] = useState(10)
    const [yLength, setY] = useState(10)
    const [zLength, setZ] = useState(3) //@ts-ignore
    const [map, setMap] = useState(null) as [any[][][], (arg0: any) => {}]
    const [xPos, setXPos] = useState(0)
    const [yPos, setYPos] = useState(0)
    const [dir, setDir] = useState('S')
    const [random, setRandom] = useState(0)

    function changeValue(e: any) {
        e.preventDefault()
        let value: string = e.target.value
        let x = parseInt(e.target.id.split(' ')[0])
        let y = parseInt(e.target.id.split(' ')[1])

        if (parseInt(value) > 0) {
            let _value = parseInt(value)
            for (let i = 0; i < _value && i < zLength; i++) {
                map[x][y][i] = 'A'
            }
            for (let i = _value; i < zLength; i++) {
                map[x][y][i] = 'n'
            }
            if(_value > zLength) e.target.value = zLength
            e.target.className = `${styles.input} ${styles.block}`
        } else if (value.startsWith('q')) {
            for (let i = 0; i < 2; i++) {
                map[x][y][i] = 'q'
            }
            for (let i = 2; i < zLength; i++) {
                map[x][y][i] = 'n'
            }
            e.target.className = `${styles.input} ${styles.stone}`
        } else {
            for (let i = 0; i < zLength; i++) {
                map[x][y][i] = 'n'
            }
            e.target.className = styles.input
        }

        if (value.endsWith('k')) {
            map[x][y][zLength] = 'K'
            e.target.className = `${styles.input} ${styles.redMarker}`
        } else if (value.endsWith('l')) {
            map[x][y][zLength] = 'L'
            e.target.className = `${styles.input} ${styles.yellowMarker}`
        } else if (value.endsWith('m')) {
            map[x][y][zLength] = 'M'
            e.target.className = `${styles.input} ${styles.blueMarker}`
        } else if (value.endsWith('n')) {
            map[x][y][zLength] = 'N'
            e.target.className = `${styles.input} ${styles.greenMarker}`
        } else {
            map[x][y][zLength] = 'o'
        }

        if(e.target.id == `${xPos} ${yPos}`) e.target.classList.add(styles.spawn)
    }

    function donwloadMap() {
        let mapStr = `KarolVersion3.0 ${xLength} ${yLength} ${zLength} ${xPos} ${yPos} `
        mapStr +=
            dir == 'S' ? '0 ' :
            dir == 'W' ? '1 ' : 
            dir == 'N' ? '2 ' :
            dir == 'O' ? '3 ' : '0 '
        mapStr += map.flat(3).join(' ')
        mapStr += ` ${xPos + 1} ${yPos + 1} ${dir}`

        let fileName = 'level.kdw'
        let data = new Blob([mapStr])
        const element = document.createElement("a")
        element.style.display = "none"
        element.href = URL.createObjectURL(data)
        element.download = fileName
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    useEffect(() => {
        let newMap: any[][][] = []
        for (let i = 0; i < xLength; i++) {
            newMap[i] = []
            for (let j = 0; j < yLength; j++) {
                newMap[i][j] = []
                for (let k = 0; k < zLength; k++) {
                    newMap[i][j][k] = map?.[i]?.[j]?.[k]?.length == zLength ? map?.[i]?.[j]?.[k] || 'n' : 'n'
                }
                newMap[i][j].push('o')
            }
        }
        setMap(newMap)
        console.log('refresh0')
    }, [xLength, yLength, zLength, random])

    useEffect(() => {
        document.querySelectorAll(`.${styles.input}`).forEach((e) => {
            if(e.classList.contains(styles.spawn)) e.classList.remove(styles.spawn)
        })
        document.getElementById(`${xPos} ${yPos}`)?.classList.add(styles.spawn)
        console.log('refresh1')
    }, [xPos, yPos])

    useEffect(() => {
        document.querySelectorAll(`.${styles.input}`).forEach((e) => { //@ts-ignore
            e.value = ''
            e.className = styles.input
        })
        document.getElementById(`${xPos} ${yPos}`)?.classList.add(styles.spawn)
        console.log('refresh2')
    },[map])

    return (
        <div className={styles.container}>
            <h2>Robot Karol Map Editor</h2>
            <div>
                <div className={styles.settings}>
                    <div>
                        <form onSubmit={e => {
                            e.preventDefault() //@ts-ignore
                            setX(Math.abs(e.target[0].value))
                        }}>
                            <label className={styles.label}>X</label>
                            <input type="number" placeholder='10' />
                        </form>
                        <form onSubmit={e => {
                            e.preventDefault() //@ts-ignore
                            setY(Math.abs(e.target[0].value))
                        }}>
                            <label className={styles.label}>Y</label>
                            <input type="number" placeholder='10' />
                        </form>
                        <form onSubmit={e => {
                            e.preventDefault() //@ts-ignore
                            setZ(Math.abs(e.target[0].value))
                        }}>
                            <label className={styles.label}>Z</label>
                            <input type="number" placeholder='3' />
                        </form>
                    </div>
                    <div>
                        <form onSubmit={e => {
                            e.preventDefault() //@ts-ignore
                            let int = Math.abs(e.target[0].value)
                            if (int >= xLength) int = xLength - 1
                            setXPos(int) //@ts-ignore
                            e.target[0].value = int
                        }
                        }>
                            <label className={styles.label}>X Position</label>
                            <input type="number" placeholder='0' />
                        </form>
                        <form onSubmit={e => {
                            e.preventDefault() //@ts-ignore
                            let int = Math.abs(e.target[0].value)
                            if (int >= yLength) int = yLength - 1
                            setYPos(int) //@ts-ignore
                            e.target[0].value = int
                        }
                        }>
                            <label className={styles.label}>Y Position</label>
                            <input type="number" placeholder='0' />
                        </form>
                        <form onSubmit={e => {
                            e.preventDefault() //@ts-ignore
                            let str = e.target[0].value
                            if(!/^[nNwWsSoO]$/.test(str)) str = 'N'
                            else str = str.toUpperCase()
                            setDir(str) //@ts-ignore
                            e.target[0].value = str
                        }}>
                            <label className={styles.label}>Direction</label>
                            <input type="text" placeholder='N/W/S/O' />
                        </form>
                    </div>
                </div>
                <div className={styles.mapY}>
                    {
                        map?.map((xArr, x) => {
                            return (
                                <div key={String(x)} className={styles.mapX}>
                                    {
                                        xArr?.map((yArr, y) => {
                                            return (
                                                <form key={`${x} ${y}`} className={styles.input} onSubmit={(e) => e.preventDefault()} onChange={
                                                    e => changeValue(e)
                                                }>
                                                    <input key={`${x} ${y}`} id={`${x} ${y}`} className={styles.input} type="text" />
                                                </form>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.space} />
                <button onClick={donwloadMap}>Download</button>
                <span> </span>
                <button onClick={() => {setRandom(Math.random)}}>Clear</button>
                <h4>Erklärungen</h4>
                <ul>
                    <li>Leeres Feld: nichts</li>
                    <li><span style={{color: 'cadetblue'}}>q</span>...: Quader</li>
                    <li><span style={{color: 'aliceblue'}}>[int]...</span>: Höhe der zu platzierenden Ziegel</li>
                    <li>...<span style={{color: 'crimson'}}>k</span>: Rote Markierung</li> 
                    <li>...<span style={{color: 'goldenrod'}}>l</span>: Gelbe Markierung</li> 
                    <li>...<span style={{color: 'cornflowerblue'}}>m</span>: Blaue Markierung</li>
                    <li>...<span style={{color: 'olivedrab'}}>n</span>: Grüne Markierung</li>
                    <li><span style={{color: 'mediumslateblue'}}>Lila Feld</span>: Spawnpoint</li>
                </ul>
                <h4>Beispiele</h4>
                <ul>
                    <li>q: Quader</li>
                    <li>4: Ziegel mit Höhe 4</li>
                    <li>n: Grüne Markierung</li>
                    <li>2l: 2 Ziegel mit gelber Markierung</li>
                </ul>
                <div className={styles.space} />
            </div>
        </div>
    )
}

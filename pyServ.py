import sys, json
import numpy as np

import base64

import urllib3
urllib3.disable_warnings()


def get_N1_tile(x, y, z):
    find_tile = False
    while (find_tile == False) and (z > 1):
        url = 'https://.......site.org/1.x/?l=sat&ll='+str(x)+','+str(y)+'&z='+str(z)
        #print(url)
        http = urllib3.PoolManager()
        r = http.request('GET', url, preload_content=False)    
        #print(r.status)
        if (r.status == 200):
            find_tile = True
        else:
            z -= 1
    if (find_tile == False):
        r = None
    return r

def get_N2_tile(x, y, z):
    find_tile = False
    while (find_tile == False) and (z > 1):
         url = 'http://.......site.org2/x='+str(x)+'&amp;y='+str(y)+'&amp;z='+str(z)
        print(url)
        http = urllib3.PoolManager()
        r = http.request('GET', url, preload_content=False)    
        print(r.status)
        if (r.status == 200):
            find_tile = True
        else:
            z -= 1
    if (find_tile == False):
        r = None
    return r

def save_tile_image(x, y, z, source, r):
    filename = './content/image_'+str(x)+'-'+str(y)+'___'+str(z)+'.jpg'
    with open(filename, 'wb') as f:
        f.write(r.data)
        #print(filename)



def get_tiles(x1, y1, x2, y2, step, z, source):
    cnt = 0
    for i in np.arange(float(x1), float(x2), step):
        for j in np.arange(float(y1), float(y2), step):
            cnt += 1
            x = round(i, 4)
            y = round(j, 4)
            z = 19
            r = None
            if (source == 'N1'):
                r = get_N1_tile(x, y, z) 
            if (source == 'N2'):
                r = get_N2_tile(x, y, z) 
            if r:
                save_tile_image(x, y, z, source, r)
    print('Ready! Downloaded',cnt,'tiles between coordinates:',x1,y1,'and',x2,y2)


def main():
    if (len(sys.argv) == 5):
        step = 0.001
        z = 19
        source = 'N1'
        x1, y1, x2, y2 = sys.argv[1:]
        get_tiles(x1, y1, x2, y2, step, z, source)
    else:
        print('Error in arguments. Must be 4 values!')
        return('error ')






  
#start process
if __name__ == '__main__':
    main()

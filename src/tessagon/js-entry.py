from tessagon.types.hex_tessagon import HexTessagon
from tessagon.adaptors.list_adaptor import ListAdaptor
from tessagon.misc.shapes import plane

from tessagon.core.tessagon_discovery import ALL

def getAllTesselationNames():
    return [x.__name__ for x in ALL]

def getTesselationFromName(name):
    return [x for x in ALL if name == x.__name__][0]

def makeTesselationFromNameAndOptions(name, options):
    tesselator = getTesselationFromName(name)
    tessagon = tesselator(**options)

    bmesh = tessagon.create_mesh()
    return bmesh


def makeTesselationFromName(name, u_range_lo, u_range_hi, v_range_lo, v_range_hi, u_num, v_num, rot_factor):
    options = {
        'function': plane,
        'u_range': [u_range_lo, u_range_hi],
        'v_range': [v_range_lo, v_range_hi],
        'u_num': u_num,
        'v_num': v_num,
        'u_cyclic': False,
        'v_cyclic': False,
        'adaptor_class' : ListAdaptor,
        'rot_factor': rot_factor
      }
    return makeTesselationFromNameAndOptions(name, options)

    tesselator = getTesselationFromName(name)
    tessagon = tesselator(**options)

    bmesh = tessagon.create_mesh()
    return bmesh

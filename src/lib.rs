mod murmur2_hash;

extern "C" {
    pub fn log(number: u32);
}

#[no_mangle]
extern "C" fn main() {
    unsafe {
        log(42);
    }
}

static mut output_ptr: *mut u8 = std::ptr::null_mut();
static mut input_ptr: *mut u8 = std::ptr::null_mut();

unsafe fn format_radix(mut x: u32, radix: u32) {
    let mut result: Vec<u8> = Vec::from_raw_parts(output_ptr, 10, 10);
    result.clear();
    loop {
        let m = x % radix;
        x = x / radix;

        // will panic if you use a bad radix (< 2 or > 36).
        result.push(from_digit(m).unwrap());

        if x == 0 {
            break;
        }
    }

    result.reverse();
}

pub fn from_digit(num: u32) -> Option<u8> {
    if num < 36 {
        let num = num as u8;
        if num < 10 {
            Some(b'0' + num)
        } else {
            Some(b'a' + num - 10)
        }
    } else {
        None
    }
}

#[no_mangle]
pub unsafe extern "C" fn hash(len: usize) {
    // create a `Vec<u8>` from the pointer and length
    // here we could also use Rust's excellent FFI
    // libraries to read a string, but for simplicity,
    // we are using the same method as for plain byte arrays
    let mut data = Vec::from_raw_parts(input_ptr, len, len);
    // read a Rust `String` from the byte array,
    let hash_res = murmur2_hash::hash(&data, u32::from_le_bytes);
    format_radix(hash_res, 36);
}

#[no_mangle]
pub unsafe extern "C" fn alloc(size: usize) -> *mut u8 {
    let align = std::mem::align_of::<u8>();
    let layout = std::alloc::Layout::from_size_align(size, align).unwrap();
    let ptr = std::alloc::alloc(layout);
    ptr
}

#[no_mangle]
pub unsafe extern "C" fn dealloc(ptr: *mut u8, size: usize) {
    let align = std::mem::align_of::<u8>();
    let layout = std::alloc::Layout::from_size_align(size, align).unwrap();
    std::alloc::dealloc(ptr, layout);
}

#[no_mangle]
pub unsafe extern "C" fn alloc_input() -> *mut u8 {
    input_ptr = alloc(3000);
    input_ptr
}

#[no_mangle]
pub unsafe extern "C" fn alloc_output() -> *mut u8 {
    output_ptr = alloc(10);
    output_ptr
}
